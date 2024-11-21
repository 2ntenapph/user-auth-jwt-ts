"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPermissions = exports.hasPermission = void 0;
// Define permissions based on roles
const rolesPermissions = {
    admin: ['view_user_info', 'update_user_info', 'delete_user'],
    verified_user: ['view_user_info'],
    user: [],
};
// Function to check if the user has permission for a given action
const hasPermission = (role, action) => {
    const permissions = rolesPermissions[role] || [];
    return permissions.includes(action);
};
exports.hasPermission = hasPermission;
// Function to get all permissions for a given role
const getPermissions = (role) => {
    return rolesPermissions[role] || [];
};
exports.getPermissions = getPermissions;
