import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { IComplianceCheck } from "../interface/compliance-check.interface";
import { KnowledgeResource } from "../../knowledge-manager/enity/knowledge-resource.enity";
import { User } from "../../users/entity/user.enity";

@Entity({ name: "compliance_checks" })
export class ComplianceCheck implements IComplianceCheck {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => KnowledgeResource, { onDelete: "CASCADE" })
  @JoinColumn({ name: "knowledge_resource_id" })
  knowledgeResourceId!: KnowledgeResource;

  @Column({ type: "boolean", default: false, name: "gdpr_compliant" })
  gdprCompliant!: boolean;

  @Column({ type: "boolean", default: false, name: "localisation_compliant" })
  localisationCompliant!: boolean;

  @ManyToOne(() => User, { onDelete: "SET NULL" })
  @JoinColumn({ name: "checked_by" })
  checkedBy!: User;

  @Column({ type: "datetime", name: "checked_at" })
  checkedAt!: Date;
}

export type IComplianceCheckEntity = ComplianceCheck;
