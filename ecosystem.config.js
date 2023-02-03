module.exports = {
  apps: [
    {
      name: "Executive",
      namespace: "ravgarcım",
      script: 'main.ravgar',
      watch: false,
      exec_mode: "cluster",
      max_memory_restart: "2G",
      cwd: "./Bots/Executive"
    }, 
    {
      name: "Guard_I",
      namespace: "ravgarcım",
      script: 'main.ravgar',
      watch: false,
      exec_mode: "cluster",
      max_memory_restart: "2G",
      cwd: "./Bots/Guard_I"
    }, 
    {
      name: "Guard_II",
      namespace: "ravgarcım",
      script: 'main.ravgar',
      watch: false,
      exec_mode: "cluster",
      max_memory_restart: "2G",
      cwd: "./Bots/Guard_II"
    }, 
    {
      name: "Guard_III",
      namespace: "ravgarcım",
      script: 'main.ravgar',
      watch: false,
      exec_mode: "cluster",
      max_memory_restart: "2G",
      cwd: "./Bots/Guard_III"
    }, 
    {
      name: "Guard_IV",
      namespace: "ravgarcım",
      script: 'main.ravgar',
      watch: false,
      exec_mode: "cluster",
      max_memory_restart: "2G",
      cwd: "./Bots/Guard_IV"
    },   
    {
      name: "ExecutivePlus",
      namespace: "ravgarcım",
      script: 'main.ravgar',
      watch: false,
      exec_mode: "cluster",
      max_memory_restart: "2G",
      cwd: "./Bots/ExecutivePlus"
    },
  ]
};


