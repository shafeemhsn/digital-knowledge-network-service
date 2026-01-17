import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { IKnowledgeMetadata } from "../interface/knowledge-metadata.interface";
import { KnowledgeResource } from "./knowledge-resource.enity";
import { Region } from "../../geo-location/entity/region.entity";

@Entity()
export class KnowledgeMetadata implements IKnowledgeMetadata {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => KnowledgeResource, { onDelete: "CASCADE" })
  @JoinColumn({ name: "knowledge_resource_id" })
  knowledgeResourceId!: KnowledgeResource;

  @ManyToOne(() => Region, { nullable: true })
  @JoinColumn({ name: "region_id" })
  regionId?: Region | null;

  @Column({ name: "document_type" })
  documentType!: string;

  @Column({ name: "project_name" })
  projectName!: string;

  @Column()
  domain!: string;

  @Column({ type: "simple-json", nullable: true })
  tags?: string | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}

export type IKnowledgeMetadataEntity = KnowledgeMetadata;
