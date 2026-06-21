const SHEET_NAME = "Confirmaciones";

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) {
      throw new Error(`No existe la hoja "${SHEET_NAME}"`);
    }

    const data = JSON.parse(e.postData.contents);
    sheet.appendRow([
      new Date(),
      safeCell(data.attendance),
      safeCell(data.fullName),
      safeCell(data.phone),
      safeCell(data.guests),
      safeCell(data.children),
      safeCell(data.dietary),
      safeCell(data.message),
      safeCell(data.createdAt),
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function safeCell(value) {
  const text = String(value || "");
  return /^[=+\-@]/.test(text) ? `'${text}` : text;
}
