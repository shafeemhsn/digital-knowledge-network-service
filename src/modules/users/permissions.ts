import { PermissionName, RoleName } from "./role-permission.enums";

export const PERMISSIONS: Record<PermissionName, RoleName[]> = {
  [PermissionName.VIEW_KNOWLEDGE]: [
    RoleName.NEW_CONSULTANT,
    RoleName.CONSULTANT,
    RoleName.SENIOR_CONSULTANT,
    RoleName.COMPLIANCE_OFFICER,
    RoleName.GOVERNANCE_COUNCIL,
  ],
  [PermissionName.RATE_KNOWLEDGE]: [
    RoleName.CONSULTANT,
    RoleName.SENIOR_CONSULTANT,
  ],
  [PermissionName.SAVE_FAVORITES]: [
    RoleName.CONSULTANT,
    RoleName.SENIOR_CONSULTANT,
  ],
  [PermissionName.UPLOAD_KNOWLEDGE]: [RoleName.SENIOR_CONSULTANT],
  [PermissionName.REVIEW_COMPLIANCE]: [RoleName.COMPLIANCE_OFFICER],
  [PermissionName.REVIEW_GOVERNANCE]: [RoleName.GOVERNANCE_COUNCIL],
  [PermissionName.VIEW_ANALYTICS]: [
    RoleName.GOVERNANCE_COUNCIL,
    RoleName.COMPLIANCE_OFFICER,
  ],
};
