import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { IPublishingRecord } from "../interface/publishing-record.interface";
import { PublishingScope } from "../interface/compliance.enums";
import { KnowledgeResource } from "../../knowledge-manager/enity/knowledge-resource.enity";
import { User } from "../../users/entity/user.enity";

@Entity({ name: "publishing_records" })
export class PublishingRecord implements IPublishingRecord {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => KnowledgeResource, { onDelete: "CASCADE" })
  @JoinColumn({ name: "knowledge_resource_id" })
  knowledgeResourceId!: KnowledgeResource;

  @Column({
    type: "text",
    enum: PublishingScope,
  })
  scope!: PublishingScope;

  @ManyToOne(() => User, { onDelete: "SET NULL" })
  @JoinColumn({ name: "published_by" })
  publishedBy!: User;

  @Column({ type: "datetime", name: "published_at" })
  publishedAt!: Date;
}

export type IPublishingRecordEntity = PublishingRecord;
