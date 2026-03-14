// Альтернативная версия (более строгая)
// Если хотите гарантировать ровно одно свойство:
// typescript
type ExactlyOne<T, K extends keyof T = keyof T> = 
  K extends keyof T 
    ? Required<Pick<T, K>> & { [P in Exclude<keyof T, K>]?: never }
    : never;

type IGraphicInstructionOne = ExactlyOne<GraphicInstructionProps>;

// Усовершенствованная версия с лучшими ошибками
// typescript
type OneOf<T> = {
  [K in keyof T]: 
    & { [P in K]: T[P] }
    & { [P in Exclude<keyof T, K>]?: never }
}[keyof T];

type IGraphicInstruction = OneOf<{
    tgb_sheet: string;
    tde_dm_sheet: string;
    another_sheet: number;
}>;
