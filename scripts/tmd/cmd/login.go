package cmd

import (
	log "github.com/sirupsen/logrus"
	"github.com/spf13/cobra"
)

// loginCmd represents the login command
var loginCmd = &cobra.Command{
	Use:   "login",
	Short: "切换当前腾讯云用户",
	Long:  `切换当前tcb登录用户，生成当前用户的.env和env.js配置文件`,
	Run: func(cmd *cobra.Command, args []string) {

		client := promptClients()

		writeEnvFile(&config, client)
		writeJsFile(client)

		exec("tcb", "logout")
		if len(client.SecretID) > 0 && len(client.SecretKey) > 0 {
			exec("tcb", "login", "--apiKeyId", client.SecretID, "--apiKey", client.SecretKey)
		} else {
			exec("tcb", "login")
		}
		log.Info("用户切换完成")

	},
}

func init() {
	rootCmd.AddCommand(loginCmd)

}
