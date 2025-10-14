import { SetMetadata } from "@nestjs/common";

export const IS_INVITATION_TOKEN_KEY = "invitationToken";

export const InvitationTokenAccess = () => SetMetadata(IS_INVITATION_TOKEN_KEY, true);
