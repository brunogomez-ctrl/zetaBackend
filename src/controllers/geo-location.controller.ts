// import { Request, Response } from 'express';
// import { db } from '../db';
// import { geoLocation } from '../db/schema/geo-location';
// import { eq, isNull } from 'drizzle-orm';

// // GET /api/geo-locations           -> nivel 1 (raíces, parent_id IS NULL)
// // GET /api/geo-locations?parentId=19 -> hijos directos del id 19
// export async function getGeoLocationChildren(req: Request, res: Response) {
//   const parentIdParam = req.query.parentId;
//   const parentId = parentIdParam != null ? Number(parentIdParam) : null;

//   const rows = await db
//     .select({ id: geoLocation.id, name: geoLocation.name, code: geoLocation.code })
//     .from(geoLocation)
//     .where(parentId === null ? isNull(geoLocation.parentId) : eq(geoLocation.parentId, parentId))
//     .orderBy(geoLocation.name);

//   res.json(rows);
// }

import { Request, Response } from 'express';
import { db } from '../db';
import { geoLocation } from '../db/schema/geo-location';
import { alias } from 'drizzle-orm/mysql-core';
import { eq, isNull } from 'drizzle-orm';

const parentAlias = alias(geoLocation, 'parent_gl');

// GET /api/geo-locations           -> raíces
// GET /api/geo-locations?parentId=19 -> hijos directos del id 19
//
// 'Raíz' = parent_id IS NULL, O parent_id apunta a un id que no existe como fila
// (pasa en datos de prueba donde solo se migraron las sucursales hoja, sin las
// regiones intermedias) — un LEFT JOIN contra sí misma cubre ambos casos a la vez.
export async function getGeoLocationChildren(req: Request, res: Response) {
  const parentIdParam = req.query.parentId;

  if (parentIdParam == null) {
    const rows = await db
      .select({ id: geoLocation.id, name: geoLocation.name, code: geoLocation.code })
      .from(geoLocation)
      .leftJoin(parentAlias, eq(parentAlias.id, geoLocation.parentId))
      .where(isNull(parentAlias.id))
      .orderBy(geoLocation.name);
    return res.json(rows);
  }

  const parentId = Number(parentIdParam);
  const rows = await db
    .select({ id: geoLocation.id, name: geoLocation.name, code: geoLocation.code })
    .from(geoLocation)
    .where(eq(geoLocation.parentId, parentId))
    .orderBy(geoLocation.name);

  res.json(rows);
}