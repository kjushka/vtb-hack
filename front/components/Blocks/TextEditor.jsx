import dynamic from 'next/dynamic';
import { useState } from 'react';

import { TextViewer, Loader } from '@components';

const TextEditor = dynamic(
	() => import('@components/TextEditor').then((mod) => mod.TextEditor),
	{
		ssr: false,
		loading: () => <Loader />,
	}
);

// const initValue = `<p class="editor-paragraph" dir="ltr" style="text-align: center;"><span>sdfsdfsdf</span></p><p class="editor-paragraph" dir="ltr"><span>sdf</span></p><p class="editor-paragraph" dir="ltr"><span>sd</span></p><p class="editor-paragraph" dir="ltr"><span>f</span></p><p class="editor-paragraph" dir="ltr"><span>sdfsd</span></p><p class="editor-paragraph" dir="ltr"><span>f</span></p><p class="editor-paragraph" dir="ltr"><span>sd</span></p><p class="editor-paragraph" dir="ltr"><span>f</span></p><p class="editor-paragraph" dir="ltr"><span>sd</span></p><p class="editor-paragraph" dir="ltr"><span>f</span></p><p class="editor-paragraph" dir="ltr"><span>sd</span></p><p class="editor-paragraph" dir="ltr"><span>f</span></p><p class="editor-paragraph" dir="ltr"><span>sdf</span></p><p class="editor-paragraph" dir="ltr"><span>sd</span></p><p class="editor-paragraph" dir="ltr"><span>f</span></p><p class="editor-paragraph" dir="ltr"><span>sdf</span></p><p class="editor-paragraph" dir="ltr"><span>sd</span></p><p class="editor-paragraph" dir="ltr"><span>f</span></p><p class="editor-paragraph" dir="ltr"><span>sd</span></p><p class="editor-paragraph" dir="ltr"><span>f</span></p><p class="editor-paragraph" dir="ltr"><span>sdf</span></p><p class="editor-paragraph" dir="ltr"><span>;sdlfjdlkjg;ldfsgfsb</span></p><p class="editor-paragraph" dir="ltr"><br></p>`;
const initValue = '';

const TextEditorBlock = () => {
	const [value, setValue] = useState();

	return (
		<div
			style={{
				width: 900,
				display: 'flex',
				flexDirection: 'column',
				gap: 10,
			}}>
			<h3>Редактор текста:</h3>
			<TextViewer value={value} />
			<TextEditor initValue={initValue} onChange={setValue} />
		</div>
	);
};
export { TextEditorBlock };
