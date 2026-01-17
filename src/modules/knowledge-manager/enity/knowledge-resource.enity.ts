import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { IKnowledgeResource } from "../interface/knowledge-resource.interface";
import { KnowledgeResourceStatus } from "../interface/knowledge-resource.status";
import { User } from "../../users/entity/user.enity";

@Entity()
export class KnowledgeResource implements IKnowledgeResource {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  title!: string;

  @Column({ type: "text", nullable: true })
  description?: string | null;

  @Column({ type: "text", nullable: true })
  content?: string | null;

  @Column({ type: "text", nullable: true })
  category?: string | null;

  @Column({
    type: "text",
    enum: KnowledgeResourceStatus,
    default: KnowledgeResourceStatus.DRAFT,
  })
  status!: KnowledgeResourceStatus;

  @Column({ type: "boolean", default: false, name: "duplicate_flag" })
  duplicateFlag!: boolean;

  @Column({ type: "boolean", default: false, name: "outdated_flag" })
  outdatedFlag!: boolean;

  @Column({ type: "float", default: 0 })
  rating!: number;

  @Column({ type: "integer", default: 0, name: "rating_count" })
  ratingCount!: number;

  @Column({ type: "integer", default: 0 })
  views!: number;

  @Column({ type: "datetime", nullable: true, name: "published_at" })
  publishedAt?: Date | null;

  @Column({ type: "boolean", default: false, name: "has_personal_data" })
  hasPersonalData!: boolean;

  @Column({ type: "boolean", default: false, name: "has_client_info" })
  hasClientInfo!: boolean;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "uploaded_by" })
  uploadedBy!: User;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}

export type IKnowledgeResourceEntity = KnowledgeResource;
