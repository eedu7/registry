use rusqlite::{Connection, Result, OptionalExtension};
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use tauri::Manager;

#[derive(Debug, Serialize, Deserialize)]
pub struct Member {
    pub id: Option<i64>,
    pub name: String,
    pub father_husband_name: String,
    pub gender: String,
    pub cnic_number: String,
    pub date_of_birth: String,
    pub date_of_issue: String,
    pub date_of_expiry: String,
    pub cnic_front_image: Option<Vec<u8>>,
    pub cnic_back_image: Option<Vec<u8>>,
}

fn get_db_path(app_handle: &tauri::AppHandle) -> PathBuf {
    let app_dir = app_handle
        .path()
        .app_data_dir()
        .expect("failed to get app data dir");
    
    fs::create_dir_all(&app_dir).expect("failed to create app data directory");
    app_dir.join("registry.db")
}

fn init_database(app_handle: &tauri::AppHandle) -> Result<()> {
    let db_path = get_db_path(app_handle);
    let conn = Connection::open(db_path)?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS members (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            father_husband_name TEXT NOT NULL,
            gender TEXT NOT NULL,
            cnic_number TEXT NOT NULL UNIQUE,
            date_of_birth TEXT NOT NULL,
            date_of_issue TEXT NOT NULL,
            date_of_expiry TEXT NOT NULL,
            cnic_front_image BLOB,
            cnic_back_image BLOB,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )",
        [],
    )?;

    Ok(())
}

#[tauri::command]
fn add_member(app_handle: tauri::AppHandle, member: Member) -> Result<String, String> {
    let db_path = get_db_path(&app_handle);
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    conn.execute(
        "INSERT INTO members (name, father_husband_name, gender, cnic_number, date_of_birth, date_of_issue, date_of_expiry, cnic_front_image, cnic_back_image)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)",
        (
            &member.name,
            &member.father_husband_name,
            &member.gender,
            &member.cnic_number,
            &member.date_of_birth,
            &member.date_of_issue,
            &member.date_of_expiry,
            &member.cnic_front_image,
            &member.cnic_back_image,
        ),
    )
    .map_err(|e| e.to_string())?;

    Ok("Member added successfully".to_string())
}

#[tauri::command]
fn get_all_members(app_handle: tauri::AppHandle) -> Result<Vec<Member>, String> {
    let db_path = get_db_path(&app_handle);
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare("SELECT id, name, father_husband_name, gender, cnic_number, date_of_birth, date_of_issue, date_of_expiry, cnic_front_image, cnic_back_image FROM members")
        .map_err(|e| e.to_string())?;

    let members = stmt
        .query_map([], |row| {
            Ok(Member {
                id: row.get(0)?,
                name: row.get(1)?,
                father_husband_name: row.get(2)?,
                gender: row.get(3)?,
                cnic_number: row.get(4)?,
                date_of_birth: row.get(5)?,
                date_of_issue: row.get(6)?,
                date_of_expiry: row.get(7)?,
                cnic_front_image: row.get(8)?,
                cnic_back_image: row.get(9)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(members)
}

#[tauri::command]
fn update_member(app_handle: tauri::AppHandle, id: i64, member: Member) -> Result<String, String> {
    let db_path = get_db_path(&app_handle);
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    let rows_affected = conn.execute(
        "UPDATE members 
         SET name = ?1, 
             father_husband_name = ?2, 
             gender = ?3, 
             cnic_number = ?4, 
             date_of_birth = ?5, 
             date_of_issue = ?6, 
             date_of_expiry = ?7, 
             cnic_front_image = ?8, 
             cnic_back_image = ?9
         WHERE id = ?10",
        (
            &member.name,
            &member.father_husband_name,
            &member.gender,
            &member.cnic_number,
            &member.date_of_birth,
            &member.date_of_issue,
            &member.date_of_expiry,
            &member.cnic_front_image,
            &member.cnic_back_image,
            id,
        ),
    )
    .map_err(|e| e.to_string())?;

    if rows_affected == 0 {
        return Err("Member not found".to_string());
    }

    Ok("Member updated successfully".to_string())
}

#[tauri::command]
fn get_member_by_cnic(app_handle: tauri::AppHandle, cnic_number: String) -> Result<Option<Member>, String> {
    let db_path = get_db_path(&app_handle);
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare("SELECT id, name, father_husband_name, gender, cnic_number, date_of_birth, date_of_issue, date_of_expiry, cnic_front_image, cnic_back_image FROM members WHERE cnic_number = ?1")
        .map_err(|e| e.to_string())?;

    let member = stmt
        .query_row([cnic_number], |row| {
            Ok(Member {
                id: row.get(0)?,
                name: row.get(1)?,
                father_husband_name: row.get(2)?,
                gender: row.get(3)?,
                cnic_number: row.get(4)?,
                date_of_birth: row.get(5)?,
                date_of_issue: row.get(6)?,
                date_of_expiry: row.get(7)?,
                cnic_front_image: row.get(8)?,
                cnic_back_image: row.get(9)?,
            })
        })
        .optional()
        .map_err(|e| e.to_string())?;

    Ok(member)
}

#[tauri::command]
fn delete_member(app_handle: tauri::AppHandle, id: i64) -> Result<String, String> {
    let db_path = get_db_path(&app_handle);
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    conn.execute("DELETE FROM members WHERE id = ?1", [id])
        .map_err(|e| e.to_string())?;

    Ok("Member deleted successfully".to_string())
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            init_database(&app.handle())?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            add_member,
            get_all_members,
            get_member_by_cnic,
            update_member,
            delete_member
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}