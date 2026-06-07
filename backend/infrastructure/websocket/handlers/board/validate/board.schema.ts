import { z } from "zod";
 

// Координата в пикселях - положительное или отрицательное (canvas может быть со смещением)
const coord = z.number().finite().min(-10_000).max(10_000);

// Размер - только положительный
const size = z.number().finite().positive().max(10_000);

// Цвет - hex или rgba
const color = z
  .string()
  .max(50)
  .regex(
    /^(#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})|rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+\s*)?\))$/,
    "Invalid color format",
  );

// Толщина линии
const strokeWidth = z.number().finite().positive().max(100);

// Точка [x, y]
const point = z.tuple([coord, coord]);

// Массив точек - не более 1000 (один непрерывный stroke)
const points = z.array(point).min(1).max(1_000);

// R2 object key - без URL, без path traversal, без пробелов
const r2Key = z
  .string()
  .min(1)
  .max(500)
  .regex(/^[a-zA-Z0-9_\-/.]+$/, "Invalid R2 key format")
  .refine((k) => !k.includes(".."), "Path traversal is not allowed");




// ACTIONS

// brush 
const brushData = z.object({
  points:      points,
  color:       color,
  strokeWidth: strokeWidth,
  opacity:     z.number().min(0).max(1).optional(),
});

// line 
const lineData = z.object({
  x1:          coord,
  y1:          coord,
  x2:          coord,
  y2:          coord,
  color:       color,
  strokeWidth: strokeWidth,
  opacity:     z.number().min(0).max(1).optional(),
});

// rect
const rectData = z.object({
  x:           coord,
  y:           coord,
  width:       size,
  height:      size,
  color:       color,
  strokeWidth: strokeWidth,
  fill:        color.optional(),    
  opacity:     z.number().min(0).max(1).optional(),
});

// circle
const circleData = z.object({
  cx:          coord,               // центр X
  cy:          coord,               // центр Y
  rx:          size,                // радиус X
  ry:          size,                // радиус Y
  color:       color,
  strokeWidth: strokeWidth,
  fill:        color.optional(),
  opacity:     z.number().min(0).max(1).optional(),
});

// text
const textData = z.object({
  x:          coord,
  y:          coord,
  content:    z.string().min(1).max(500).trim(),
  fontSize:   z.number().int().positive().max(200),
  fontFamily: z.enum(["sans-serif", "serif", "monospace"]).optional(),
  color:      color,
  bold:       z.boolean().optional(),
  italic:     z.boolean().optional(),
});

// erase
const eraseData = z.object({
  points:      points,
  strokeWidth: strokeWidth,
});

// image - вставка изображения из R2
const imageData = z.object({
  fileKey: r2Key,
  x:       coord,
  y:       coord,
  width:   size,
  height:  size,
});



export const boardActionSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("brush"),  data: brushData  }),
  z.object({ type: z.literal("line"),   data: lineData   }),
  z.object({ type: z.literal("rect"),   data: rectData   }),
  z.object({ type: z.literal("circle"), data: circleData }),
  z.object({ type: z.literal("text"),   data: textData   }),
  z.object({ type: z.literal("erase"),  data: eraseData  }),
  z.object({ type: z.literal("image"),  data: imageData  }),
]);

export type ValidatedActionPayload = z.infer<typeof boardActionSchema>;
export type ValidatedBoardAction = z.infer<typeof boardActionSchema>;
export type BoardActionType      = ValidatedBoardAction["type"];


// Схема полного входящего action (без userId/timestamp -> сервер проставляет)
export const incomingBoardActionSchema = z.object({
  lessonId:  z.string().uuid(),
  pageIndex: z.number().int().nonnegative(),
  // type и data валидирую вместе через discriminatedUnion
  type: z.enum(["brush", "line", "rect", "circle", "text", "erase", "image"]),
  data: z.unknown(), // сначала принимаем unknown, затем парсим через boardActionSchema
});



const baseSchema = z.object({
  lessonId:  z.string().uuid("lessonId must be UUID"),
  pageIndex: z.number().int().nonnegative(),
  type:      z.enum(["brush", "line", "rect", "circle", "text", "erase", "image"]),
  data:      z.unknown(),
});
 
export type ParseResult =
  | { success: true;  lessonId: string; pageIndex: number; action: ValidatedBoardAction }
  | { success: false; error: string };
 
export const parseIncomingAction = (raw: unknown): ParseResult => {
  // Шаг 1: базовая структура (lessonId UUID, pageIndex int, type enum)
  const base = baseSchema.safeParse(raw);
  console.log(base);
  if (!base.success) {
    return { success: false, error: base.error.issues[0]?.message ?? "Invalid structure" };
  }
 
  // Шаг 2: type + data вместе через discriminatedUnion
  // Каждый type имеет строгую схему data — несоответствие = ошибка
  const payload = boardActionSchema.safeParse({
    type: base.data.type,
    data: base.data.data,
  });
  console.log(payload);
  if (!payload.success) {
    return { success: false, error: payload.error.issues[0]?.message ?? "Invalid action data" };
  }
 
  return {
    success:   true,
    lessonId:  base.data.lessonId,
    pageIndex: base.data.pageIndex,
    action:    payload.data,
  };
}