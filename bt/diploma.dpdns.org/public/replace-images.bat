@echo off
echo 关于我们页面图片替换脚本
echo ========================
echo.

rem 创建必要的目录
mkdir "public\images\general" 2>nul
echo 已确保目录存在: public\images\general

echo.
echo 步骤1: 请复制您的第一张图片(蓝色背景的人物照片)到以下位置:
echo       public\images\general\about-us.jpg
echo.
echo 步骤2: 请复制您的第二张图片(蓝色横幅校园庆典)到以下位置:
echo       public\images\founding.jpg
echo.
echo 您也可以替换以下可选图片:
echo - public\images\expansion.jpg (校园扩展图片)  
echo - public\images\online.jpg (在线学习图片)
echo - public\images\today.jpg (现代校园图片)
echo.
echo 完成后, 请刷新浏览器查看效果。
echo.
echo 按任意键退出...
pause >nul 