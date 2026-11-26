
/**
 * Rich Response types adapted from @sairidev/baileys.
 *
 * If you use or copy this code, please credit my name or project. AND DO NOT CHANGE THIS NOTE
 * @sairidev/baileys
 */

export enum CodeHighlightType {
	DEFAULT = 0,
	KEYWORD = 1,
	METHOD = 2,
	STRING = 3,
	NUMBER = 4,
	COMMENT = 5
}

export enum RichSubMessageType {
	UNKNOWN = 0,
	GRID_IMAGE = 1,
	TEXT = 2,
	INLINE_IMAGE = 3,
	TABLE = 4,
	CODE = 5,
	DYNAMIC = 6,
	MAP = 7,
	LATEX = 8,
	CONTENT_ITEMS = 9
}

export type RichCodeBlock = {
	highlightType: CodeHighlightType
	codeContent: string
}

export type RichResponseTableRow = {
	isHeading: boolean
	items: string[]
}

export type RichResponseTextItem = {
	text: string
	inlineEntities?: unknown[]
}

export type RichResponseCodeItem = {
	code: RichCodeBlock[]
	language?: string
}

export type RichResponseTableItem = {
	table: RichResponseTableRow[]
	title?: string
}

export type RichResponseItem =
	| RichResponseTextItem
	| RichResponseCodeItem
	| RichResponseTableItem

export type RichResponseLinkSource = {
	displayName?: string
	subtitle?: string
	url?: string
}

export type RichResponseLink = {
	text: string
	url?: string
	title?: string
	displayName?: string
	sources?: RichResponseLinkSource[]
}

export type RichResponseMessageContent = {
	headerText?: string
	contentText?: string
	disclaimerText?: string
	footerText?: string
	language?: string
	title?: string
	noHeading?: boolean
	richResponse?: RichResponseItem[]
	code?: string
	links?: RichResponseLink[]
	table?: string[][]
} & (
	| { richResponse: RichResponseItem[] }
	| { code: string }
	| { links: RichResponseLink[] }
	| { table: string[][] }
)
