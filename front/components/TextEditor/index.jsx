import { useEffect } from 'react';

import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { $getRoot, $getSelection } from 'lexical';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { TRANSFORMERS } from '@lexical/markdown';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

import { theme } from './theme';
import {
	PlaygroundAutoLinkPlugin as AutoLinkPlugin,
	CodeHighlightPlugin,
	ListMaxIndentLevelPlugin,
	ToolbarPlugin,
} from './plugins';

import './style.module.scss';
import { toClassName } from '@utils/toClassName';

function Placeholder({ text = '' }) {
	return (
		<div className='editor-placeholder'>
			{text ? text : 'Enter some rich text...'}
		</div>
	);
}

const editorConfig = {
	// The editor theme
	theme,
	// Handling of errors during update
	onError: (error) => console.error(error),
	// Any custom nodes go here
	nodes: [
		HeadingNode,
		ListNode,
		ListItemNode,
		QuoteNode,
		CodeNode,
		CodeHighlightNode,
		TableNode,
		TableCellNode,
		TableRowNode,
		AutoLinkNode,
		LinkNode,
	],
};

const ChangeText = ({ onChange = () => {} }) => {
	const [editor] = useLexicalComposerContext();

	useEffect(() => {
		editor.registerUpdateListener(({ editorState }) => {
			editorState.read(() => {
				onChange($generateHtmlFromNodes(editor));
			});
		});
	}, [editor, onChange]);

	return null;
};

const SetInitText = ({ value }) => {
	const [editor] = useLexicalComposerContext();

	useEffect(() => {
		editor.update(() => {
			const parser = new DOMParser();
			const dom = parser.parseFromString(value, 'text/html');
			$getRoot().select();
			const selection = $getSelection();
			selection.insertNodes($generateNodesFromDOM(editor, dom));
		});
	}, [editor]);

	return null;
};

const TextEditor = ({
	initValue = '',
	onChange = () => {},
	className = '',
	placeholder = '',
}) => {
	return (
		<LexicalComposer initialConfig={editorConfig}>
			<div className={toClassName('editor-container', className)}>
				<ToolbarPlugin />
				<div className='editor-inner'>
					<RichTextPlugin
						contentEditable={
							<ContentEditable className='editor-input' />
						}
						placeholder={<Placeholder text={placeholder} />}
					/>
					<HistoryPlugin />
					{/* <TreeViewPlugin /> */}
					<AutoFocusPlugin />
					<CodeHighlightPlugin />
					<ListPlugin />
					<LinkPlugin />
					<AutoLinkPlugin />
					<ListMaxIndentLevelPlugin maxDepth={7} />
					<MarkdownShortcutPlugin transformers={TRANSFORMERS} />
					<ChangeText onChange={onChange} />
					<SetInitText value={initValue} />
				</div>
			</div>
		</LexicalComposer>
	);
};

const TextViewer = ({ value, className = '' }) => {
	return (
		<div
			className={className}
			dangerouslySetInnerHTML={{ __html: value }}
		/>
	);
};

export { TextEditor, TextViewer };
