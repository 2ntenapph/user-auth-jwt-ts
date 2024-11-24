import app from "./app";
import { logInfo } from "./utils/loggerHelper";

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  logInfo("Email Service Started", { port: PORT });
});
