import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { IKnowledgeResource } from "./knowledge-resource.interface";
import { KnowledgeResourceStatus } from "./knowledge-resource.status";
import { User } from "../../../users/models/user.model";

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

  @Column({ type: "boolean", default: false })
  duplicate_flag!: boolean;

  @Column({ type: "boolean", default: false })
  outdated_flag!: boolean;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "uploaded_by" })
  uploaded_by!: User;

  @CreateDateColumn({ name: "created_at" })
  created_at!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updated_at!: Date;
}

export type IKnowledgeResourceEntity = KnowledgeResource;
