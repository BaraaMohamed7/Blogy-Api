import { Injectable, Inject } from '@nestjs/common';
import { type Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { PaginationQueryDto } from '../dtos/pagination-query.dto';
import { ObjectLiteral, Repository } from 'typeorm';
import { Paginated } from '../interfaces/paginated.interface';

@Injectable()
export class PaginationProvider {
  /** Constructor to inject the request object for potential future use (e.g., accessing query parameters) */
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  /** Paginates a query using the provided pagination parameters and repository */
  public async paginateQuery<T extends ObjectLiteral>(
    paginationQuery: PaginationQueryDto,
    repository: Repository<T>,
  ): Promise<Paginated<T>> {
    const result = await repository.find({
      take: paginationQuery.limit,
      skip: (paginationQuery.page! - 1) * paginationQuery.limit!,
    });

    const baseUrl = `${this.request.protocol}://${this.request.get('host')}/`;
    const newUrl = new URL(this.request.url, baseUrl);

    console.log(baseUrl);
    console.log(newUrl);

    const totalItems = await repository.count();
    const totalPages = Math.ceil(totalItems / paginationQuery.limit!);
    const nextPage =
      paginationQuery.page === totalPages
        ? paginationQuery.page
        : paginationQuery.page! + 1;
    const prevPage =
      paginationQuery.page === 1
        ? paginationQuery.page
        : paginationQuery.page! - 1;

    const response: Paginated<T> = {
      data: result,
      meta: {
        totalItems,
        totalPages,
        itemsPerPage: paginationQuery.limit!,
        currentPage: paginationQuery.page!,
      },
      links: {
        first: `${newUrl.origin}${newUrl.pathname}?page=1&limit=${paginationQuery.limit}`,
        last: `${newUrl.origin}${newUrl.pathname}?page=${totalPages}&limit=${paginationQuery.limit}`,
        previous: `${newUrl.origin}${newUrl.pathname}?page=${prevPage}&limit=${paginationQuery.limit}`,
        next: `${newUrl.origin}${newUrl.pathname}?page=${nextPage}&limit=${paginationQuery.limit}`,
        current: `${newUrl.origin}${newUrl.pathname}?page=${paginationQuery.page}&limit=${paginationQuery.limit}`,
      },
    };

    return response;
  }
}
