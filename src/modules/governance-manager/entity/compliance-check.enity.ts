import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { IComplianceCheck } from "../interface/compliance-check.interface";
import { KnowledgeResource } from "../../knowledge-manager/enity/knowledge-resource.enity";
import { User } from "../../users/user.enity";

@Entity({ name: "compliance_checks" })
export class ComplianceCheck implements IComplianceCheck {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => KnowledgeResource, { onDelete: "CASCADE" })
  @JoinColumn({ name: "knowledge_resource_id" })
  knowledge_resource_id!: KnowledgeResource;

  @Column({ type: "boolean", default: false })
  gdpr_compliant!: boolean;

  @Column({ type: "boolean", default: false })
  localisation_compliant!: boolean;

  @ManyToOne(() => User, { onDelete: "SET NULL" })
  @JoinColumn({ name: "checked_by" })
  checked_by!: User;

  @Column({ type: "datetime", name: "checked_at" })
  checked_at!: Date;
}

export type IComplianceCheckEntity = ComplianceCheck;
