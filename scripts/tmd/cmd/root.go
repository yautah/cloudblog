package cmd

import (
	log "github.com/sirupsen/logrus"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

type (
	Client struct {
		Name       string `json:"name"`
		Version    string `json:"version"`
		EnvID      string `json:"envid"`
		AppID      string `json:"appid"`
		PrivateKey string `json:"private_key"`
		SecretID   string `json:"secretId"`
		SecretKey  string `json:"secretKey"`
	}

	Config struct {
		Name          string `json:"name"`
		Version       string `json:"version"`
		FrameworkName string `json:"frameworkName"`
		MP            struct {
			Version    string `json:"version"`
			Desc       string `json:"desc"`
			DeployMode string `json:"deployMode"`
		} `json:"mp"`
		Clients []Client `json:"clients"`
	}
)

var (
	cfgFile  string
	logLevel string

	config Config

	rootCmd = &cobra.Command{
		Use:   "deploy",
		Short: "云开发小程序一键部署系统",
		Long:  `云开发小程序一键部署系统`,
	}
)

// Execute executes the root command.
func Execute() error {
	return rootCmd.Execute()
}

func init() {

	cobra.OnInitialize(initConfig)

	rootCmd.PersistentFlags().StringVarP(&cfgFile, "config", "c", "./deploy.json", "配置文件")
	rootCmd.PersistentFlags().StringVarP(&logLevel, "log-level", "l", "info", "设置日志等级 [debug, info, warn, error, fatal]")

	configureLogging()
}

func er(msg ...interface{}) {
	log.Fatal(msg...)
}

func initConfig() {
	if cfgFile != "" {
		// Use config file from the flag.
		viper.SetConfigType("json")
		viper.SetConfigFile(cfgFile)
	} else {
		// Search config in home directory with name ".cobra" (without extension).
		viper.AddConfigPath("./")
		viper.SetConfigName(".deploy.json")
	}

	viper.AutomaticEnv()

	if err := viper.ReadInConfig(); err == nil {
		log.Info("配置文件:", viper.ConfigFileUsed())

		err := viper.Unmarshal(&config)
		if err != nil {
			log.Fatal("解析配置文件错误", err)
		}

	} else {
		er("配置文件", viper.ConfigFileUsed(), "不存在，退出!:")
	}
}

func configureLogging() {

	// log.SetFormatter(&log.JSONFormatter{})
	// log.SetFormatter(new(prefixed.TextFormatter))
	log.SetFormatter(&log.TextFormatter{
		FullTimestamp: false,
	})
	if level, err := log.ParseLevel(logLevel); err != nil {
		log.Error("日志等级配置错误: ", logLevel, "只能是 [debug, info, warn, error, fatal]", err)
		log.SetLevel(log.InfoLevel)
	} else {
		log.SetLevel(level)
	}
}
