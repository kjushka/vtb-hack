import {
	NotificationsBlock,
	IslandBlock,
	ButtonsBlock,
	PopupBlock,
	InputsBlock,
	TextEditorBlock,
	LoaderBlock,
	ProductCardBlock,
} from '../../components/Blocks';

import styles from './style.module.scss';

const TestPaage = ({}) => {
	return (
		<div className={styles.root}>
			<ProductCardBlock />
			<IslandBlock />
			<NotificationsBlock />
			<ButtonsBlock />
			<PopupBlock />
			<InputsBlock />
			<TextEditorBlock />
			<LoaderBlock />
		</div>
	);
};

export default TestPaage;
