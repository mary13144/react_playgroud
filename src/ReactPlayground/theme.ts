export type Theme = 'light' | 'dark'

interface ThemeContentType{
	text:string,
	bg:string,
	border:string,
	editingBg:string,
	activeText: string,  // 激活状态的文本颜色
}

export type ThemesType = {
	[key in Theme]: ThemeContentType
}

export const themes:ThemesType = {
	dark:{
		text: '#E0E0E0',          // 浅灰色文本，适合深色背景
		bg: '#2C2C2C',            // 深灰色背景
		border: '#383838',
		editingBg: '#3A3A3A',      // 编辑时的稍亮的深灰色背景
		activeText: '#64B5F6',    // 激活状态的亮蓝色文本
	},
	light:{
		text: '#333333',          // 深灰色文本，适合浅色背景
		bg: '#F5F5F5',            // 浅灰色背景
		border:'#ddd',
		editingBg: '#E0E0E0',     // 编辑时的中灰色背景
		activeText: '#4A90E2',    // 激活状态的蓝色文本
	}
}