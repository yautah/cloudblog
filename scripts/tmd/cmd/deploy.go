package cmd

import (
	"fmt"
	"github.com/manifoldco/promptui"
	log "github.com/sirupsen/logrus"
	"github.com/spf13/cobra"
	"io/ioutil"
	"os"
	cmd "os/exec"
	"strings"
)

var Actions = []map[string]string{
	{"code": "all", "name": "全部"},
	{"code": "function", "name": "云函数"},
	{"code": "mp", "name": "小程序"},
	{"code": "migrate", "name": "数据库迁移"},
	{"code": "auth", "name": "修改云环境权限"},
	{"code": "trigger", "name": "上传触发器"},
}

func init() {
	rootCmd.AddCommand(deployCmd)
}

var deployCmd = &cobra.Command{
	Use:   "deploy",
	Short: "一键部署云开发小程序",
	RunE:  deployFunc,
}

var deployFunc = func(cmd *cobra.Command, args []string) error {

	client := promptClients()

	writeEnvFile(&config, client)
	writeJsFile(client)

	exec("tcb", "logout")
	if len(client.SecretID) > 0 && len(client.SecretKey) > 0 {
		exec("tcb", "login", "--apiKeyId", client.SecretID, "--apiKey", client.SecretKey)
	} else {
		exec("tcb", "login")
	}

	log.Info("客户信息")
	log.Infof("-- 客户: %s", client.Name)
	log.Infof("-- 版本：%s", client.Version)
	log.Info("\n")
	log.Info(`应用配置`)
	log.Infof("-- 应用名称: %s", config.FrameworkName)
	log.Info("-- 加密秘钥: 123456abc")
	log.Infof("-- 小程序APPID: %s", client.AppID)
	log.Infof("-- 云环境ID: %s", client.EnvID)
	log.Infof("-- 上传秘钥路径: ./keys/private.%s.key", client.AppID)
	log.Info("\n")
	log.Info(`小程序发布配置`)
	log.Infof("-- 小程序版本号: %s", config.MP.Version)
	log.Infof("-- 小程序版本描述: %s", config.MP.Desc)
	log.Infof("-- 小程序发布模式: %s", config.MP.DeployMode)
	log.Info("\n")

	if result := promptConfirm(); result {

		action := promptActions()

		switch action["code"] {
		case "all":
			exec("tcb", "framework", "deploy", "--mode", "pro", "--config-file", "config/fn.json")
			exec("tcb", "fn", "invoke", "migrate", "--mode", "pro")
			exec("tcb", "framework", "deploy", "--config-file", "./config/mp.json", "--mode", "pro")
		case "function":
			exec("tcb", "framework", "deploy", "--mode", "pro", "--config-file", "config/fn.json")
		case "mp":
			exec("tcb", "framework", "deploy", "--config-file", "./config/mp.json", "--mode", "pro")
		case "migrate":
			exec("tcb", "fn", "invoke", "migrate", "--mode", "pro")
		case "auth":
			exec("tcb", "framework", "deploy", "--config-file", "config/auth.json", "--mode", "pro")
		case "trigger":
			exec("tcb", "fn", "trigger", "delete", "--mode", "pro", "--config-file", "config/trigger.json")
			exec("tcb", "fn", "trigger", "create", "--mode", "pro", "--config-file", "config/trigger.json")
		default:
			os.Exit(0)
		}
		log.Info("部署完成!")
		return nil

	}
	return nil

}

func promptClients() (client *Client) {
	templates := &promptui.SelectTemplates{
		Label:    "{{ . }}",
		Active:   "\U0001F336 {{ .Name | red }}",
		Inactive: "  {{ .Name | cyan }} ",
		Selected: "\U0001F336 {{ .Name | red | cyan }}",
	}

	log.Info("请选择客户:")
	prompt := promptui.Select{
		Label:     "客户列表",
		Items:     config.Clients,
		Templates: templates,
		Size:      8,
		HideHelp:  true,
	}

	i, _, err := prompt.Run()

	if err != nil {
		log.Fatal("Prompt failed %v\n", err)
	}

	return &config.Clients[i]
}

func promptActions() map[string]string {
	templates := &promptui.SelectTemplates{
		Label:    "{{ . }}",
		Active:   "\U0001F336 {{ .name | red }}",
		Inactive: "  {{ .name | cyan }} ",
		Selected: "\U0001F336 {{ .name | red | cyan }}",
	}

	log.Info("请选择部署模式:")
	prompt := promptui.Select{
		Label:     "所有操作",
		Items:     Actions,
		Templates: templates,
		Size:      8,
		HideHelp:  true,
	}

	i, _, err := prompt.Run()

	if err != nil {
		log.Fatal("Prompt failed %v\n", err)
	}

	return Actions[i]
}

func promptConfirm() bool {
	prompt := promptui.Prompt{
		Label:     "确认要以此配置进行部署吗？",
		IsConfirm: true,
	}

	_, err := prompt.Run()

	if err != nil {
		log.Info("退出")
		return false
	}

	return true
}

func promptMigrate() bool {
	prompt := promptui.Prompt{
		Label:     "是否进行数据库迁移？",
		IsConfirm: true,
	}

	_, err := prompt.Run()

	if err != nil {
		log.Info("退出")
		return false
	}

	return true
}

func writeEnvFile(config *Config, client *Client) {
	err := ioutil.WriteFile(
		".env.pro",
		[]byte(
			fmt.Sprintf(`
FRAMEWORK_NAME=%s

# 小程序提审信息
APP_VERSION=%s
APP_DESC=%s
APP_DEPLOY_MODE=%s

# 云函数代码加密秘钥
CODE_SECRET=123456abc

# %s
WX_APPID=%s
ENV_ID=%s
WX_CI_KEY_PATH=./keys/private.%s.key
		`,
				config.FrameworkName,
				config.MP.Version,
				config.MP.Desc,
				config.MP.DeployMode,
				client.Name,
				client.AppID,
				client.EnvID,
				client.AppID,
			)),
		os.ModePerm)

	if err != nil {
		log.Fatal("写入.env.pro文件错误", err)
	} else {
		log.Info("写入.env.pro文件完成")
	}

}

func writeJsFile(client *Client) {
	os.MkdirAll("miniprogram/utils", os.ModePerm)
	err := ioutil.WriteFile(
		"miniprogram/utils/env.js",
		[]byte(
			fmt.Sprintf(`
export const EnvID =  "%s"
export const Version = "%s"
		`,
				client.EnvID,
				client.Version,
			)),
		os.ModePerm)

	if err != nil {
		log.Fatal("写入env.js文件错误", err)
	} else {
		log.Info("写入env.js文件完成")
	}

}

func exec(c string, params ...string) {
	log.Info(c + " " + strings.Join(params, " "))
	cmd := cmd.Command(c, params...)
	cmd.Stdin = os.Stdin
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	err := cmd.Run()
	if err != nil {
		log.Fatal(err)
	}
}
