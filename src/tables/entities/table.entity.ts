import { Branch } from "src/branch/entities/branch.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinTable, JoinColumn } from "typeorm";

//@Entity()
export class Table {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	nro_mesa: number;

	@Column({
		default: true,
	})
	enabled: boolean;

	/*
  @ManyToOne(() => Branch, branch => branch.table)
  @JoinColumn()
  branch: Branch;
  */
}
