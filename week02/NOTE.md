# 每周总结
	ASCII 码
	非 ASCII 编码
	Unicode

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
	
	思路：
		第一步：先判断传入Unicode需要几个字节
		第二步：一个
	function encode-utf8 (unicode){
		parseInt(unicode,16).toString(2)
	}
	100 1110 0010 0101
	

#写一个正则表达式，匹配所有的字符串直接量，单引号和双引号

