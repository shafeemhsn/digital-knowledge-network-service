import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { IKnowledgeVersion } from "../interface/knowledge-version.interface";
import { KnowledgeResource } from "./knowledge-resource.enity";

@Entity()
export class KnowledgeVersion implements IKnowledgeVersion {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => KnowledgeResource, { onDelete: "CASCADE" })
  @JoinColumn({ name: "knowledge_resource_id" })
  knowledgeResourceId!: KnowledgeResource;

  @Column({ type: "integer", name: "version_no" })
  versionNo!: number;

  @Column({ name: "file_name" })
  fileName!: string;

  @Column({ name: "file_url" })
  fileUrl!: string;

  @Column({ type: "integer", name: "file_size" })
  fileSize!: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}

export type IKnowledgeVersionEntity = KnowledgeVersion;
