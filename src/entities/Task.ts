import 'reflect-metadata';
import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('tasks')
export class Task {
    @PrimaryColumn('uuid')
    id!: string;

    @Column()
    title!: string;

    @Column()
    description!: string;

    @Column({ default: false })
    completed!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
    
    constructor() {
        if (!this.id) {
            this.id = uuidv4();
        }
    }
};
