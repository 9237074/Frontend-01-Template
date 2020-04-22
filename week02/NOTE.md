# 每周总结

#一
	编程语言通识
	语法分类：
		非形式语言
		形式语言
			0型: 无限制文法
			1型: 上下文相关文法
			2型: 上下文无关文法
			3型: 正则文法
	图灵完备性
		[wiki](https://zh.wikipedia.org/wiki/%E5%9C%96%E9%9D%88%E5%AE%8C%E5%82%99%E6%80%A7)
		命令式
			goto
			if while
		声明式
			递归
			分治
	系统类型
		动态静态
		强类型弱类型
		复合类型
		子类型

#二
	[Unicode](https://www.fileformat.info/info/unicode/)
	Atom词
		InputElement
			whiteSpace
			LineTerminator
			Comment
			Token
			
# 写一个正则表达式 匹配所有 Number 直接量
	\u002e 是Unicode的.
	/[0-9]+\u002e[0-9]+|[0-9]+/g

#写一个 UTF-8 Encoding 的函数
	
	UTF-8编码规则:
	1、单字节的符号，字节的第一位设为0，后面7位为这个符号的 Unicode 码
	2、对于n字节的符号（n > 1），第一个字节的前n位都设为1，第n + 1位设为0，
	   后面字节的前两位一律设为10。剩下的没有提及的二进制位，全部为这个符号的Unicode码。
	   
	示例:
	Unicode符号范围     |        UTF-8编码方式
	   (十六进制)       |          （二进制）
	----------------------+---------------------------------------------
	0000 0000-0000 007F | 0xxxxxxx
	0000 0080-0000 07FF | 110xxxxx 10xxxxxx
	0000 0800-0000 FFFF | 1110xxxx 10xxxxxx 10xxxxxx
	0001 0000-0010 FFFF | 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
	
#写一个正则表达式，匹配所有的字符串直接量，单引号和双引号

