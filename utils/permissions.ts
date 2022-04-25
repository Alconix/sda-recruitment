export const roles = {
  ADMIN: "admin",
  OFFICIER: "officier",
  MEMBRE: "membre",
  APPLY: "apply",
};

export const mapRoleToPermissions = (role: string): number => {
  switch (role) {
    case roles.APPLY:
      return 1;
    case roles.MEMBRE:
      return 2;
    case roles.OFFICIER:
      return 4;
    case roles.ADMIN:
      return 4;
    default:
      return 0;
  }
};

export const canVote = (role: string): boolean => {
  const permissions = mapRoleToPermissions(role);
  return permissions > 1;
};

export const canModerate = (role: string): boolean => {
  const permissions = mapRoleToPermissions(role);
  return permissions === 4;
};

export const canEdit = (role: string, author_id: string, user_id: string): boolean => {
  const permissions = mapRoleToPermissions(role);
  return permissions === 4 || author_id === user_id;
};
