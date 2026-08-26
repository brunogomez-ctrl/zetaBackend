import { Request, Response } from 'express';
import { db } from '../db';
import { logicalLocation } from '../db/schema/logical-location';
import { alias } from 'drizzle-orm/mysql-core';
import { eq, isNull } from 'drizzle-orm';

const parentAlias = alias(logicalLocation, 'parent_ll');

// GET /api/logical-locations           -> raíces
// GET /api/logical-locations?parentId=15 -> hijos directos del id 15
export async function getLogicalLocationChildren(req: Request, res: Response) {
  const parentIdParam = req.query.parentId;

  if (parentIdParam == null) {
    const rows = await db
      .select({ id: logicalLocation.id, name: logicalLocation.name, code: logicalLocation.code })
      .from(logicalLocation)
      .leftJoin(parentAlias, eq(parentAlias.id, logicalLocation.parentId))
      .where(isNull(parentAlias.id))
      .orderBy(logicalLocation.name);
    return res.json(rows);
  }

  const parentId = Number(parentIdParam);
  const rows = await db
    .select({ id: logicalLocation.id, name: logicalLocation.name, code: logicalLocation.code })
    .from(logicalLocation)
    .where(eq(logicalLocation.parentId, parentId))
    .orderBy(logicalLocation.name);

  res.json(rows);
}
