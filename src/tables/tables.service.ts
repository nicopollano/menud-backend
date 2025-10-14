import { Injectable } from "@nestjs/common";
import { CreateTableDto } from "./dto/create-table.dto";
import { UpdateTableDto } from "./dto/update-table.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Table } from "./entities/table.entity";
import { ErrorList } from "src/common/enums/error.enum";
import { NotFoundException_C } from "src/common/Custom/http-response";
import { ClsService } from "nestjs-cls";

@Injectable()
export class TablesService {
	constructor(
		@InjectRepository(Table)
		private readonly tableRepository: Repository<Table>,
		private clsService: ClsService,
	) {}

	async create(createTableDto: CreateTableDto) {
		/*
    const branch = this.clsService.get("branch");
    const { nro_mesa } = createTableDto;

    const table = new Table();
    table.branch = branch;
    if (!nro_mesa) {
      const tables = await this.tableRepository.find( { where: { branch }, order: { nro_mesa: "asc" } })
      
      if(!tables) {
        
      }

      const tables_size = tables.length ?? 0;
      
      if (tables_size > 0) {
        for(const _table of tables){
          if(!_table.enabled) {
            _table.enabled = true;
            await this.tableRepository.save(_table);
            return _table;
          }

        }
        table.nro_mesa = tables[tables_size-1].nro_mesa + 1;
        table.branch = branch;
      } else {
        table.nro_mesa = 1;
      }
    } else {
      table.nro_mesa = Number(nro_mesa);
    }

    await this.tableRepository.save(table);

    return table;
    */
		return new Table();
	}

	async findAll() {
		/*
    const branch = this.clsService.get("branch");
    const tables = await this.tableRepository.find({ where: { enabled: true, branch }, order: { nro_mesa: "ASC" }});

    if(!tables) throw new NotFoundException_C(ErrorList.TableNotFound);

    return tables;
    */
		return new Table[2]();
	}

	async findOne(id: number) {
		/*
    const branch = this.clsService.get("branch");
    const table = await this.tableRepository.findOne({
      where: { nro_mesa: id, branch, enabled: true },
    });

    if(!table) throw new NotFoundException_C(ErrorList.TableNotFound);

    return table;
    */
		return new Table();
	}

	async update(id: number) {
		/*
    const branch = this.clsService.get("branch");

    const table = await this.tableRepository.findOne({
      where: { nro_mesa: id, branch },
    });

    if (!table) throw new NotFoundException_C(ErrorList.TableNotFound);

    table.enabled = true; 
    
    await this.tableRepository.save(table);

    return table;
    */
		return new Table();
	}

	async remove(id: number) {
		/*
    const branch = this.clsService.get("branch");
    const table = await this.tableRepository.findOne({
      where: { nro_mesa: id, branch },
    });

    if (!table) throw new NotFoundException_C(ErrorList.TableNotFound);

    table.enabled = false;
    
    const tableDeleted = await this.tableRepository.save(table);

    return tableDeleted;
    */
		return new Table();
	}

	filterTableResponse(table: Table) {
		/*
    const {id, branch, ...rest } = table
    return rest
    */
		return new Table();
	}
}
