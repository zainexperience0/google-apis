import { z } from "zod";

// Define User schema
const UserSchema = z.object({
  kind: z.string().optional(),
  displayName: z.string(),
  photoLink: z.string().optional(),
  me: z.boolean().optional(),
  permissionId: z.string(),
  emailAddress: z.string().email().optional()
});

// Define Permission schema
const PermissionSchema = z.object({
  kind: z.string(),
  id: z.string().optional(),
  type: z.string(),
  emailAddress: z.string().email().optional(),
  role: z.string(),
  domain: z.string().optional(),
  allowFileDiscovery: z.boolean().optional(),
  deleted: z.boolean().optional(),
  pendingOwner: z.boolean().optional(),
  teamDrivePermissionDetails: z.array(z.object({
    teamDriveId: z.string(),
    role: z.string(),
    inheritedFrom: z.string().optional(),
    inherited: z.boolean()
  })).optional(),
  permissionDetails: z.array(z.object({
    permissionType: z.string(),
    role: z.string(),
    inheritedFrom: z.string().optional(),
    inherited: z.boolean()
  })).optional()
});

// Define Content Restriction schema
const ContentRestrictionSchema = z.object({
  readOnly: z.boolean(),
  reason: z.string().optional(),
  restrictingUser: UserSchema.optional(),
  restrictionTime: z.string().optional(),
  type: z.string()
});

// Define Label schema
const LabelSchema = z.object({
  kind: z.string(),
  id: z.string(),
  revisionId: z.string(),
  fields: z.array(z.object({
    id: z.string(),
    value: z.unknown(),
    text: z.string().optional(),
    dateString: z.string().optional(),
    selectionChoice: z.string().optional()
  }))
});

// Main schema
const schema = z.object({
  kind: z.string(),
  driveId: z.string(),
  fileExtension: z.string(),
  copyRequiresWriterPermission: z.boolean(),
  md5Checksum: z.string(),
  contentHints: z.object({
    indexableText: z.string(),
    thumbnail: z.object({
      image: z.string(),
      mimeType: z.string()
    })
  }),
  writersCanShare: z.boolean(),
  viewedByMe: z.boolean(),
  mimeType: z.string(),
  exportLinks: z.record(z.string(), z.string()),
  parents: z.array(z.string()),
  thumbnailLink: z.string(),
  iconLink: z.string(),
  shared: z.boolean(),
  lastModifyingUser: UserSchema,
  owners: z.array(UserSchema),
  headRevisionId: z.string(),
  sharingUser: UserSchema,
  webViewLink: z.string(),
  webContentLink: z.string(),
  size: z.string(),
  viewersCanCopyContent: z.boolean(),
  permissions: z.array(PermissionSchema),
  hasThumbnail: z.boolean(),
  spaces: z.array(z.string()),
  folderColorRgb: z.string(),
  id: z.string(),
  name: z.string(),
  description: z.string(),
  starred: z.boolean(),
  trashed: z.boolean(),
  explicitlyTrashed: z.boolean(),
  createdTime: z.string(),
  modifiedTime: z.string(),
  modifiedByMeTime: z.string(),
  viewedByMeTime: z.string(),
  sharedWithMeTime: z.string(),
  quotaBytesUsed: z.string(),
  version: z.string(),
  originalFilename: z.string(),
  ownedByMe: z.boolean(),
  fullFileExtension: z.string(),
  properties: z.record(z.string(), z.unknown()),
  appProperties: z.record(z.string(), z.unknown()),
  isAppAuthorized: z.boolean(),
  teamDriveId: z.string(),
  capabilities: z.object({
    canChangeViewersCanCopyContent: z.boolean(),
    canMoveChildrenOutOfDrive: z.boolean(),
    canReadDrive: z.boolean(),
    canEdit: z.boolean(),
    canCopy: z.boolean(),
    canComment: z.boolean(),
    canAddChildren: z.boolean(),
    canDelete: z.boolean(),
    canDownload: z.boolean(),
    canListChildren: z.boolean(),
    canRemoveChildren: z.boolean(),
    canRename: z.boolean(),
    canTrash: z.boolean(),
    canReadRevisions: z.boolean(),
    canReadTeamDrive: z.boolean(),
    canMoveTeamDriveItem: z.boolean(),
    canChangeCopyRequiresWriterPermission: z.boolean(),
    canMoveItemIntoTeamDrive: z.boolean(),
    canUntrash: z.boolean(),
    canModifyContent: z.boolean(),
    canMoveItemWithinTeamDrive: z.boolean(),
    canMoveItemOutOfTeamDrive: z.boolean(),
    canDeleteChildren: z.boolean(),
    canMoveChildrenOutOfTeamDrive: z.boolean(),
    canMoveChildrenWithinTeamDrive: z.boolean(),
    canTrashChildren: z.boolean(),
    canMoveItemOutOfDrive: z.boolean(),
    canAddMyDriveParent: z.boolean(),
    canRemoveMyDriveParent: z.boolean(),
    canMoveItemWithinDrive: z.boolean(),
    canShare: z.boolean(),
    canMoveChildrenWithinDrive: z.boolean(),
    canModifyContentRestriction: z.boolean(),
    canAddFolderFromAnotherDrive: z.boolean(),
    canChangeSecurityUpdateEnabled: z.boolean(),
    canAcceptOwnership: z.boolean(),
    canReadLabels: z.boolean(),
    canModifyLabels: z.boolean(),
    canModifyEditorContentRestriction: z.boolean(),
    canModifyOwnerContentRestriction: z.boolean(),
    canRemoveContentRestriction: z.boolean()
  }),
  hasAugmentedPermissions: z.boolean(),
  trashingUser: UserSchema,
  thumbnailVersion: z.string(),
  trashedTime: z.string(),
  modifiedByMe: z.boolean(),
  permissionIds: z.array(z.string()),
  imageMediaMetadata: z.object({
    flashUsed: z.boolean(),
    meteringMode: z.string(),
    sensor: z.string(),
    exposureMode: z.string(),
    colorSpace: z.string(),
    whiteBalance: z.string(),
    width: z.number().int(),
    height: z.number().int(),
    location: z.object({
      latitude: z.number(),
      longitude: z.number(),
      altitude: z.number()
    }),
    rotation: z.number().int(),
    time: z.string(),
    cameraMake: z.string(),
    cameraModel: z.string(),
    exposureTime: z.number(),
    aperture: z.number(),
    focalLength: z.number(),
    isoSpeed: z.number().int(),
    exposureBias: z.number(),
    maxApertureValue: z.number(),
    subjectDistance: z.number().int(),
    lens: z.string()
  }),
  videoMediaMetadata: z.object({
    width: z.number().int(),
    height: z.number().int(),
    durationMillis: z.string()
  }),
  shortcutDetails: z.object({
    targetId: z.string(),
    targetMimeType: z.string(),
    targetResourceKey: z.string()
  }),
  contentRestrictions: z.array(ContentRestrictionSchema),
  resourceKey: z.string(),
  linkShareMetadata: z.object({
    securityUpdateEligible: z.boolean(),
    securityUpdateEnabled: z.boolean()
  }),
  labelInfo: z.object({
    labels: z.array(LabelSchema)
  }),
  sha1Checksum: z.string(),
  sha256Checksum: z.string()
});
