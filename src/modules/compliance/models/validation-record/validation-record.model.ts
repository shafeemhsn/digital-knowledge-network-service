import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { IValidationRecord } from "./validation-record.interface";
import { ValidationDecision } from "../compliance-check/compliance.enums";
import { KnowledgeResource } from "../../../knowledge-resources/models/knowledge-resource.model";
import { User } from "../../../users/models/user.model";

@Entity({ name: "validation_records" })
export class ValidationRecord implements IValidationRecord {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => KnowledgeResource, { onDelete: "CASCADE" })
  @JoinColumn({ name: "knowledge_resource_id" })
  knowledge_resource_id!: KnowledgeResource;

  @Column({
    type: "text",
    enum: ValidationDecision,
  })
  decision!: ValidationDecision;

  @ManyToOne(() => User, { onDelete: "SET NULL" })
  @JoinColumn({ name: "validated_by" })
  validated_by!: User;

  @Column({ type: "datetime", name: "validated_at" })
  validated_at!: Date;
}

export type IValidationRecordEntity = ValidationRecord;
