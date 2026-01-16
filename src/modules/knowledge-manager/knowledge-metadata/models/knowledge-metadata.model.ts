import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { IKnowledgeMetadata } from "./knowledge-metadata.interface";
import { KnowledgeResource } from "../../knowledge-resources/models/knowledge-resource.model";

@Entity()
export class KnowledgeMetadata implements IKnowledgeMetadata {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => KnowledgeResource, { onDelete: "CASCADE" })
  @JoinColumn({ name: "knowledge_resource_id" })
  knowledge_resource_id!: KnowledgeResource;

  @Column()
  document_type!: string;

  @Column()
  project_name!: string;

  @Column()
  domain!: string;

  @Column({ type: "simple-json", nullable: true })
  tags?: string | null;

  @CreateDateColumn({ name: "created_at" })
  created_at!: Date;
}

export type IKnowledgeMetadataEntity = KnowledgeMetadata;
