export const routes = {
  api: {
    drafts: "/api/drafts",
    teams: {
      $: "/api/teams",
      leave: "/api/teams/leave",
      remove: "/api/teams/remove",
      create: "/api/teams/create",
      join: "/api/teams/join",
    },
    companies: "/api/companies",
    majors: {
      $: "/api/majors",
      categories: "/api/majors/categories",
    },
    offers: {
      $: "/api/offers",
      save: "/api/offers/save",
      add: "/api/offers/add",
      unsave: "/api/offers/unsave",
      apply: {
        single: "/api/offers/apply",
        team: "/api/offers/apply/team",
      },
      candidates: "/api/offers/candidates",
    },
    employers: {
      email: "/api/employers/email",

      $: "/api/employers",
    },
    users: {
      $: "/api/users",
      basic: "/api/users/basic",
      image: {
        upload: "/api/users/image/upload",
      },
      cv: {
        upload: "/api/users/cv/upload",
      },
      email: "/api/users/email",
    },
    chat: "/api/chat",
    universities: {
      $: "/api/universities",
      name: "/api/universities/name",
    },
    applications: {
      team: {
        $: "/api/applications/team",
        return: "/api/applications/team/return",
        accept: "/api/applications/team/accept",
        reject: "/api/applications/team/reject",
      },
      single: {
        $: "/api/applications/single",
        return: "/api/applications/single/return",
        accept: "/api/applications/single/accept",
        reject: "/api/applications/single/reject",
      },
    },
    degrees: "/api/degrees",
  },
};
