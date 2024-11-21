// Define permissions based on roles
const rolesPermissions: Record<string, string[]> = {
    admin: ['view_user_info', 'update_user_info', 'delete_user'],
    verified_user: ['view_user_info'],
    user: [],
  };
  
  // Function to check if the user has permission for a given action
  export const hasPermission = (role: string, action: string): boolean => {
    const permissions = rolesPermissions[role] || [];
    return permissions.includes(action);
  };
  
  // Function to get all permissions for a given role
  export const getPermissions = (role: string): string[] => {
    return rolesPermissions[role] || [];
  };
  