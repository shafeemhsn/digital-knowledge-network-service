import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

import { IPublishedRecord } from "./published-record.interface";
import { PublishingScope } from "./compliance.enums";

@Entity({ name: "published_record" })
export class PublishedRecord implements IPublishedRecord {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  region!: string;

  @Column({
    type: "text",
    enum: PublishingScope,
  })
  scope!: PublishingScope;

  @Column({ type: "datetime", name: "publised_at" })
  publisedAt!: Date;

  @Column({ type: "boolean", default: false })
  active!: boolean;
}

export type IPublishedRecordEntity = PublishedRecord;
