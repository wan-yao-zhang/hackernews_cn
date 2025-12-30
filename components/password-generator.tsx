"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Copy, RefreshCw, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function PasswordGenerator() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState([16]);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generatePassword = useCallback(() => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    let charset = "";
    if (includeUppercase) charset += uppercase;
    if (includeLowercase) charset += lowercase;
    if (includeNumbers) charset += numbers;
    if (includeSymbols) charset += symbols;

    if (charset.length === 0) {
      setPassword("");
      return;
    }

    let newPassword = "";
    const passwordLength = length[0];
    
    // 确保至少包含每种选中的字符类型中的一个
    if (includeUppercase) {
      newPassword += uppercase[Math.floor(Math.random() * uppercase.length)];
    }
    if (includeLowercase) {
      newPassword += lowercase[Math.floor(Math.random() * lowercase.length)];
    }
    if (includeNumbers) {
      newPassword += numbers[Math.floor(Math.random() * numbers.length)];
    }
    if (includeSymbols) {
      newPassword += symbols[Math.floor(Math.random() * symbols.length)];
    }

    // 填充剩余长度
    for (let i = newPassword.length; i < passwordLength; i++) {
      newPassword += charset[Math.floor(Math.random() * charset.length)];
    }

    // 打乱字符顺序
    newPassword = newPassword
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");

    setPassword(newPassword);
    setCopied(false);
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  const copyToClipboard = async () => {
    if (password) {
      try {
        await navigator.clipboard.writeText(password);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast({
          title: "复制成功",
          description: "密码已复制到剪贴板",
        });
      } catch (err) {
        toast({
          title: "复制失败",
          description: "无法复制到剪贴板，请手动复制",
          variant: "destructive",
        });
      }
    }
  };

  // 初始生成密码
  useEffect(() => {
    generatePassword();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>密码生成器</CardTitle>
        <CardDescription>生成安全、随机的密码</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 密码显示区域 */}
        <div className="flex gap-2">
          <Input
            type="text"
            value={password}
            readOnly
            className="text-lg font-mono"
            placeholder="生成的密码将显示在这里"
          />
          <Button
            onClick={copyToClipboard}
            disabled={!password}
            variant="outline"
            size="icon"
            className="shrink-0"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
          <Button
            onClick={generatePassword}
            variant="outline"
            size="icon"
            className="shrink-0"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {/* 密码长度滑块 */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="length">密码长度: {length[0]}</Label>
          </div>
          <Slider
            id="length"
            min={4}
            max={64}
            step={1}
            value={length}
            onValueChange={setLength}
            className="w-full"
          />
        </div>

        {/* 选项复选框 */}
        <div className="space-y-4">
          <Label>包含字符类型：</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="uppercase"
                checked={includeUppercase}
                onCheckedChange={(checked) =>
                  setIncludeUppercase(checked === true)
                }
              />
              <Label
                htmlFor="uppercase"
                className="text-sm font-normal cursor-pointer"
              >
                大写字母 (A-Z)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="lowercase"
                checked={includeLowercase}
                onCheckedChange={(checked) =>
                  setIncludeLowercase(checked === true)
                }
              />
              <Label
                htmlFor="lowercase"
                className="text-sm font-normal cursor-pointer"
              >
                小写字母 (a-z)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="numbers"
                checked={includeNumbers}
                onCheckedChange={(checked) =>
                  setIncludeNumbers(checked === true)
                }
              />
              <Label
                htmlFor="numbers"
                className="text-sm font-normal cursor-pointer"
              >
                数字 (0-9)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="symbols"
                checked={includeSymbols}
                onCheckedChange={(checked) =>
                  setIncludeSymbols(checked === true)
                }
              />
              <Label
                htmlFor="symbols"
                className="text-sm font-normal cursor-pointer"
              >
                特殊字符 (!@#$...)
              </Label>
            </div>
          </div>
        </div>

        {/* 生成按钮 */}
        <Button onClick={generatePassword} className="w-full" size="lg">
          <RefreshCw className="mr-2 h-4 w-4" />
          重新生成密码
        </Button>
      </CardContent>
    </Card>
  );
}

