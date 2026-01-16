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
import { User } from "../../users/user.enity";

@Entity()
export class KnowledgeResource implements IKnowledgeResource {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  title!: string;

  @Column({ type: "text", nullable: true })
  description?: string | null;

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

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "uploaded_by" })
  uploadedBy!: User;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}

export type IKnowledgeResourceEntity = KnowledgeResource;
