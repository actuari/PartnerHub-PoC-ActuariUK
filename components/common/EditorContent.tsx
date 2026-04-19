import DOMPurify from 'isomorphic-dompurify';
import draftToHtml from 'draftjs-to-html';
import { RawDraftContentState } from 'draft-js';

function createMarkup(html: string) {
    return {
        __html: DOMPurify.sanitize(html)
    }
}
export default function EditorContent(props: { content: RawDraftContentState }) {
    return (
        <div
            dangerouslySetInnerHTML={createMarkup(draftToHtml(props.content))}
        ></div>
    )
}
