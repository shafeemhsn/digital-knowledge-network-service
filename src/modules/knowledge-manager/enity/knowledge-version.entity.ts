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
  knowledge_resource_id!: KnowledgeResource;

  @Column({ type: "integer" })
  version_no!: number;

  @Column()
  file_name!: string;

  @Column()
  file_url!: string;

  @Column({ type: "integer" })
  file_size!: number;

  @CreateDateColumn({ name: "created_at" })
  created_at!: Date;
}

export type IKnowledgeVersionEntity = KnowledgeVersion;
