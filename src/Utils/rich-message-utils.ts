
/**
 * Rich Response utilities adapted from @sairidev/baileys.
 *
 * If you use or copy this code, please credit my name or project. AND DO NOT CHANGE THIS NOTE
 * @sairidev/baileys
 */

import { randomUUID } from 'crypto'
import { proto } from '../../WAProto/index.js'
import type { WAMessageContent } from '../Types/Message'
import {
	CodeHighlightType,
	RichSubMessageType,
	type RichCodeBlock,
	type RichResponseItem,
	type RichResponseMessageContent,
	type RichResponseTableRow
} from '../Types/RichType'

const NOOP = new Set<string>()

const KEYWORDS: Record<string, Set<string>> = {
	javascript: new Set([
		'async', 'await', 'break', 'case', 'catch', 'class', 'const',
		'continue', 'debugger', 'default', 'delete', 'do', 'else',
		'export', 'extends', 'false', 'finally', 'for', 'from',
		'function', 'if', 'import', 'in', 'instanceof', 'let',
		'new', 'null', 'of', 'return', 'static', 'super', 'switch',
		'this', 'throw', 'true', 'try', 'typeof', 'undefined',
		'var', 'void', 'while', 'with', 'yield'
	]),
	typescript: new Set([
		'abstract', 'any', 'as', 'asserts', 'async', 'await',
		'boolean', 'break', 'case', 'catch', 'class', 'const',
		'constructor', 'continue', 'declare', 'default', 'delete',
		'do', 'else', 'enum', 'export', 'extends', 'false',
		'finally', 'for', 'from', 'function', 'get', 'if',
		'implements', 'import', 'in', 'infer', 'instanceof',
		'interface', 'is', 'keyof', 'let', 'namespace', 'never',
		'new', 'null', 'number', 'object', 'private', 'protected',
		'public', 'readonly', 'return', 'set', 'static', 'string',
		'super', 'switch', 'symbol', 'this', 'throw', 'true',
		'try', 'type', 'typeof', 'undefined', 'unknown', 'var',
		'void', 'while', 'with', 'yield'
	]),
	python: new Set([
		'and', 'as', 'assert', 'async', 'await', 'break', 'class',
		'continue', 'def', 'del', 'elif', 'else', 'except',
		'False', 'finally', 'for', 'from', 'global', 'if',
		'import', 'in', 'is', 'lambda', 'None', 'nonlocal',
		'not', 'or', 'pass', 'raise', 'return', 'True', 'try',
		'while', 'with', 'yield'
	]),
	bash: new Set([
		'if', 'then', 'else', 'elif', 'fi', 'case', 'esac',
		'for', 'while', 'until', 'do', 'done', 'in',
		'function', 'select', 'time', 'echo', 'export',
		'return', 'exit', 'break', 'continue'
	]),
	powershell: new Set([
		'function', 'filter', 'param', 'begin', 'process', 'end',
		'if', 'else', 'elseif', 'switch', 'foreach', 'for',
		'while', 'do', 'until', 'break', 'continue', 'return',
		'throw', 'try', 'catch', 'finally'
	]),

	css: new Set([
		'important', 'inherit', 'initial', 'unset', 'revert',
		'auto', 'none', 'normal', 'absolute', 'relative',
		'fixed', 'sticky', 'block', 'inline', 'flex', 'grid',
		'visible', 'hidden', 'transparent'
	]),
	html: new Set([
		'DOCTYPE', 'html', 'head', 'body', 'title', 'meta',
		'link', 'script', 'style', 'div', 'span', 'p',
		'a', 'img', 'ul', 'ol', 'li', 'table', 'tr',
		'td', 'th', 'form', 'input', 'button', 'section',
		'article', 'header', 'footer', 'main', 'nav'
	]),
	go: new Set([
		'break', 'case', 'chan', 'const', 'continue', 'default',
		'defer', 'else', 'fallthrough', 'for', 'func', 'go',
		'goto', 'if', 'import', 'interface', 'map', 'package',
		'range', 'return', 'select', 'struct', 'switch', 'type',
		'var', 'true', 'false', 'nil'
	]),
	cpp: new Set([
		'alignas', 'auto', 'bool', 'break', 'case', 'catch',
		'char', 'class', 'const', 'constexpr', 'continue',
		'default', 'delete', 'do', 'double', 'else', 'enum',
		'explicit', 'extern', 'false', 'float', 'for', 'friend',
		'if', 'inline', 'int', 'long', 'namespace', 'new',
		'nullptr', 'private', 'protected', 'public', 'return',
		'short', 'signed', 'sizeof', 'static', 'struct',
		'switch', 'template', 'this', 'throw', 'true', 'try',
		'typedef', 'typename', 'union', 'unsigned', 'using',
		'virtual', 'void', 'volatile', 'while'
	]),
	c: new Set([
		'auto', 'break', 'case', 'char', 'const', 'continue',
		'default', 'do', 'double', 'else', 'enum', 'extern',
		'float', 'for', 'goto', 'if', 'inline', 'int', 'long',
		'register', 'restrict', 'return', 'short', 'signed',
		'sizeof', 'static', 'struct', 'switch', 'typedef',
		'union', 'unsigned', 'void', 'volatile', 'while'
	]),
	csharp: new Set([
		'abstract', 'as', 'base', 'bool', 'break', 'byte',
		'case', 'catch', 'char', 'class', 'const', 'continue',
		'decimal', 'default', 'delegate', 'do', 'double',
		'else', 'enum', 'event', 'explicit', 'extern', 'false',
		'finally', 'fixed', 'float', 'for', 'foreach', 'if',
		'implicit', 'in', 'int', 'interface', 'internal',
		'is', 'lock', 'long', 'namespace', 'new', 'null',
		'object', 'operator', 'out', 'override', 'params',
		'private', 'protected', 'public', 'readonly', 'ref',
		'return', 'sealed', 'short', 'sizeof', 'stackalloc',
		'static', 'string', 'struct', 'switch', 'this',
		'throw', 'true', 'try', 'typeof', 'uint', 'ulong',
		'unchecked', 'unsafe', 'ushort', 'using', 'virtual',
		'void', 'volatile', 'while'
	]),
	rust: new Set([
		'as', 'async', 'await', 'break', 'const', 'continue',
		'crate', 'dyn', 'else', 'enum', 'extern', 'false',
		'fn', 'for', 'if', 'impl', 'in', 'let', 'loop',
		'match', 'mod', 'move', 'mut', 'pub', 'ref', 'return',
		'self', 'Self', 'static', 'struct', 'super', 'trait',
		'true', 'type', 'unsafe', 'use', 'where', 'while'
	]),
	cmd: new Set([
		'assoc', 'break', 'call', 'cd', 'chcp', 'cls', 'color',
		'copy', 'date', 'del', 'dir', 'echo', 'endlocal',
		'exit', 'for', 'goto', 'if', 'md', 'mkdir', 'move',
		'pause', 'popd', 'pushd', 'rd', 'rem', 'ren', 'rename',
		'rmdir', 'set', 'setlocal', 'shift', 'start', 'time',
		'title', 'type', 'ver', 'verify', 'vol'
	])

}


const LANGUAGE_ALIASES: Record<string, string> = {
	js: 'javascript',
	jsx: 'javascript',
	ts: 'typescript',
	tsx: 'typescript',
	py: 'python',
	golang: 'go',
	'c++': 'cpp',
	h: 'c',
	rs: 'rust',
	cs: 'csharp',
	html5: 'html',
	sh: 'bash',
	zsh: 'bash',
	bat: 'cmd',
	ps1: 'powershell'
}


const LEXER_REGEX =
	/(\/\/.*|\/\*[\s\S]*?\*\/|#.*)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`[\s\S]*?`)|(\b[a-zA-Z_]\w*\b)(?=\s*\()|(\b[a-zA-Z_]\w*\b)|(\b\d+(?:\.\d+)?\b)|(\s+|[^\w\s]+)/g

export const tokenizeCode = (
	code: string,
	language = 'javascript'
): RichCodeBlock[] => {
	const normalizedLanguage = LANGUAGE_ALIASES[language.toLowerCase()] || language.toLowerCase()
	const keywords = KEYWORDS[normalizedLanguage] || NOOP
	const blocks: RichCodeBlock[] = []

	LEXER_REGEX.lastIndex = 0

	let match: RegExpExecArray | null

	while ((match = LEXER_REGEX.exec(code)) !== null) {
		if (match[1]) {
			blocks.push({
				highlightType: CodeHighlightType.COMMENT,
				codeContent: match[1]
			})
		} else if (match[2]) {
			blocks.push({
				highlightType: CodeHighlightType.STRING,
				codeContent: match[2]
			})
		} else if (match[3]) {
			blocks.push({
				highlightType: keywords.has(match[3])
					? CodeHighlightType.KEYWORD
					: CodeHighlightType.METHOD,
				codeContent: match[3]
			})
		} else if (match[4]) {
			blocks.push({
				highlightType: keywords.has(match[4])
					? CodeHighlightType.KEYWORD
					: CodeHighlightType.DEFAULT,
				codeContent: match[4]
			})
		} else if (match[5]) {
			blocks.push({
				highlightType: CodeHighlightType.NUMBER,
				codeContent: match[5]
			})
		} else {
			blocks.push({
				highlightType: CodeHighlightType.DEFAULT,
				codeContent: match[6] ?? match[0]
			})
		}
	}

	return blocks
}

type RichProtoSubmessage = {
	messageType: number
	messageText?: string
	inlineEntities?: unknown[]
	codeMetadata?: {
		codeLanguage: string
		codeBlocks: RichCodeBlock[]
	}
	tableMetadata?: {
		title?: string
		rows: RichResponseTableRow[]
	}
	[key: string]: unknown
}

export const toUnified = (submessages: RichProtoSubmessage[]) => ({
	response_id: randomUUID(),
	sections: submessages.map(submessage => {
		switch (submessage.messageType) {
			case RichSubMessageType.CODE: {
				const metadata = submessage.codeMetadata!

				return {
					view_model: {
						primitive: {
							language: metadata.codeLanguage,
							code_blocks: metadata.codeBlocks.map(block => ({
								content: block.codeContent,
								type: CodeHighlightType[block.highlightType]
							})),
							__typename: 'GenAICodeUXPrimitive'
						},
						__typename: 'GenAISingleLayoutViewModel'
					}
				}
			}

			case RichSubMessageType.TABLE: {
				const metadata = submessage.tableMetadata!

				return {
					view_model: {
						primitive: {
							title: metadata.title,
							rows: metadata.rows.map(row => ({
								is_header: row.isHeading,
								cells: row.items,
								markdown_cells: row.items.map(item => ({
									text: item
								}))
							})),
							__typename: 'GenATableUXPrimitive'
						},
						__typename: 'GenAISingleLayoutViewModel'
					}
				}
			}

			case RichSubMessageType.TEXT:
				return {
					view_model: {
						primitive: {
							text: submessage.messageText,
							inline_entities: submessage.inlineEntities || [],
							__typename: 'GenAIMarkdownTextUXPrimitive'
						},
						__typename: 'GenAISingleLayoutViewModel'
					}
				}

			default:
				return submessage
		}
	})
})

export const wrapToBotForwardedMessage = (
	richResponseMessage: proto.IAIRichResponseMessage
): WAMessageContent =>
	({
		botForwardedMessage: {
			message: { richResponseMessage }
		}
	}) as unknown as WAMessageContent

export const prepareRichResponseMessage = (
	content: RichResponseMessageContent
): WAMessageContent => {
	const {
		code,
		contentText,
		footerText,
		headerText,
		language,
		links,
		noHeading,
		richResponse,
		table,
		title
	} = content

	const submessages: RichProtoSubmessage[] = []

	if (Array.isArray(richResponse)) {
		for (const item of richResponse as RichResponseItem[]) {
			if ('text' in item) {
				submessages.push({
					messageType: RichSubMessageType.TEXT,
					messageText: item.text,
					inlineEntities: item.inlineEntities
				})
			} else if ('code' in item) {
				submessages.push({
					messageType: RichSubMessageType.CODE,
					codeMetadata: {
						codeLanguage: item.language || 'javascript',
						codeBlocks: item.code
					}
				})
			} else if ('table' in item) {
				submessages.push({
					messageType: RichSubMessageType.TABLE,
					tableMetadata: {
						title: item.title,
						rows: item.table
					}
				})
			}
		}
	} else {
		if (headerText) {
			submessages.push({
				messageType: RichSubMessageType.TEXT,
				messageText: headerText
			})
		}

		if (contentText) {
			submessages.push({
				messageType: RichSubMessageType.TEXT,
				messageText: contentText
			})
		}

		if (code) {
			const codeLanguage = language || 'javascript'

			submessages.push({
				messageType: RichSubMessageType.CODE,
				codeMetadata: {
					codeLanguage,
					codeBlocks: tokenizeCode(code, codeLanguage)
				}
			})
		} else if (links) {
			links.forEach((link, index) => {
				const prefix = `SS_${index}`
				const url =
					link.url ||
					link.sources?.find(source => source.url)?.url

				if (!url) {
					throw new TypeError(
						`Rich Response link at index ${index} requires a URL`
					)
				}

				const sources = link.sources?.map(source => ({
					source_type: 'THIRD_PARTY',
					source_display_name: source.displayName || 'Donate',
					source_subtitle: source.subtitle || 'Saweria',
					source_url: source.url || url
				}))

				submessages.push({
					messageType: RichSubMessageType.TEXT,
					messageText: `${link.text} {{${prefix}}}¹{{/${prefix}}} `,
					inlineEntities: [
						{
							key: prefix,
							metadata: {
								reference_id: index + 1,
								reference_url: url,
								reference_title: link.title || 'For Donation via Saweria',
								reference_display_name: link.displayName || 'Donation',
								sources: sources || [],
								__typename: 'GenAISearchCitationItem'
							}
						}
					]
				})
			})
		} else if (table) {
			submessages.push({
				messageType: RichSubMessageType.TABLE,
				tableMetadata: {
					title,
					rows: table.map((items, index) => ({
						isHeading: !noHeading && index === 0,
						items
					}))
				}
			})
		}

		if (footerText) {
			submessages.push({
				messageType: RichSubMessageType.TEXT,
				messageText: footerText
			})
		}
	}

	const unified = toUnified(submessages)

	const richMessage = proto.AIRichResponseMessage.create({
		submessages: submessages as never,
		messageType:
			proto.AIRichResponseMessageType.AI_RICH_RESPONSE_TYPE_STANDARD,
		unifiedResponse: {
			data: Buffer.from(JSON.stringify(unified), 'utf-8')
		},
		contextInfo: {
			isForwarded: true,
			forwardingScore: 1,
			forwardedAiBotMessageInfo: {
				botJid: '867051314767696@bot'
			},
			forwardOrigin: 4
		}
	})

	return wrapToBotForwardedMessage(richMessage)
}
