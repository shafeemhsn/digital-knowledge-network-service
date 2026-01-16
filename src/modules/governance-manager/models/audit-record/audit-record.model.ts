import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { IAuditRecord } from "./audit-record.interface";
import { KnowledgeResource } from "../../../knowledge-manager/knowledge-resources/models/knowledge-resource.model";
import { User } from "../../../users/models/user.model";

@Entity({ name: "audit_records" })
export class AuditRecord implements IAuditRecord {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => KnowledgeResource, { onDelete: "CASCADE" })
  @JoinColumn({ name: "knowledge_resource_id" })
  knowledge_resource_id!: KnowledgeResource;

  @Column()
  findings!: string;

  @ManyToOne(() => User, { onDelete: "SET NULL" })
  @JoinColumn({ name: "audited_by" })
  audited_by!: User;

  @Column({ type: "datetime", name: "audited_at" })
  audited_at!: Date;
}

export type IAuditRecordEntity = AuditRecord;
