import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { IPublishingRecord } from "./publishing-record.interface";
import { PublishingScope } from "./compliance.enums";
import { KnowledgeResource } from "../../knowledge-resources/models/knowledge-resource.model";
import { User } from "../../users/models/user.model";

@Entity({ name: "publishing_records" })
export class PublishingRecord implements IPublishingRecord {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => KnowledgeResource, { onDelete: "CASCADE" })
  @JoinColumn({ name: "knowledge_resource_id" })
  knowledge_resource_id!: KnowledgeResource;

  @Column({
    type: "text",
    enum: PublishingScope,
  })
  scope!: PublishingScope;

  @ManyToOne(() => User, { onDelete: "SET NULL" })
  @JoinColumn({ name: "published_by" })
  published_by!: User;

  @Column({ type: "datetime", name: "published_at" })
  published_at!: Date;
}

export type IPublishingRecordEntity = PublishingRecord;
