import { PublishingScope } from "./compliance.enums";

export interface IPublishedRecord {
  id?: string;
  region: string;
  scope: PublishingScope;
  publisedAt: Date;
  active: boolean;
}
