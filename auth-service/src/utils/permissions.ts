import { logInfo, logWarn } from "../utils/loggerHelper"; // Import logging helpers

// Define permissions based on roles
const rolesPermissions: Record<string, string[]> = {
  admin: ["view_user_info", "update_user_info", "delete_user"],
  verified_user: ["view_user_info"],
  user: [],
};

// Function to check if the user has permission for a given action
export const hasPermission = (role: string, action: string): boolean => {
  const permissions = rolesPermissions[role] || [];
  const hasAccess = permissions.includes(action);

  if (hasAccess) {
    logInfo("Permission Granted", { role, action });
  } else {
    logWarn("Permission Denied", { role, action });
  }

  return hasAccess;
};

// Function to get all permissions for a given role
export const getPermissions = (role: string): string[] => {
  const permissions = rolesPermissions[role] || [];
  logInfo("Permissions Retrieved", { role, permissions });
  return permissions;
};
