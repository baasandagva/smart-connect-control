package com.example.jb;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.widget.ImageView;
import android.widget.Switch;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

public class SettingsActivity extends AppCompatActivity {

    Switch switchFakeMode;
    TextView btnLanguage, btnReconnectWiFi, btnAbout;
    ImageView btnBack;
    SharedPreferences pref;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        pref = getSharedPreferences("settings", MODE_PRIVATE);

        setContentView(R.layout.settings_activity);

        // UI bind
        switchFakeMode   = findViewById(R.id.switchFakeMode);
        btnLanguage      = findViewById(R.id.btnLanguage);
        btnReconnectWiFi = findViewById(R.id.btnReconnectWiFi);
        btnAbout         = findViewById(R.id.btnAbout);
        btnBack          = findViewById(R.id.btnBack);

        // Load previous FAKE mode
        boolean fake = pref.getBoolean("FAKE", true);
        switchFakeMode.setChecked(fake);

        switchFakeMode.setOnCheckedChangeListener((buttonView, isChecked) -> {
            pref.edit().putBoolean("FAKE", isChecked).apply();
            MainActivity.FAKE_MODE = isChecked;
        });

        // Load selected language on start
        String lang = pref.getString("app_lang", "MN");
        applyLanguage(lang);

        // Language button
        btnLanguage.setOnClickListener(v -> showLanguageDialog());

        // About
        btnAbout.setOnClickListener(v ->
                startActivity(new Intent(this, AboutActivity.class))
        );

        // Back button
        btnBack.setOnClickListener(v -> finish());
    }
    //==========================
    // hel solih
    //=========================

    // ---------------- LANGUAGE POPUP ----------------
    private void showLanguageDialog() {
        String[] langs = {"Монгол", "English"};

        new AlertDialog.Builder(this)
                .setTitle("Хэл сонгох")
                .setItems(langs, (dialog, which) -> {

                    String code = (which == 0) ? "MN" : "EN";

                    pref.edit().putString("app_lang", code).apply();

                    applyLanguage(code);

                    Toast.makeText(this, "Language changed", Toast.LENGTH_SHORT).show();

                    // ✔ MainActivity руу хэл солигдсоныг мэдэгдэнэ
                    Intent result = new Intent();
                    result.putExtra("lang_changed", true);
                    setResult(RESULT_OK, result);

                    finish(); // Буцах
                })
                .show();
    }


    // ---------------- APPLY LANGUAGE ----------------
    private void applyLanguage(String code) {

        TextView title = findViewById(R.id.txtSettingsTitle);
        TextView fake  = findViewById(R.id.txtFakeLabel);
        TextView lang  = findViewById(R.id.btnLanguage);
        TextView wifi  = findViewById(R.id.btnReconnectWiFi);
        TextView about = findViewById(R.id.btnAbout);
////        TextView button = findViewById(R.id.btnScanQr);
        TextView goltext = findViewById(R.id.txtStatus);
        TextView tittle = findViewById(R.id.nav_connect_wifi);


        if (code.equals("EN")) {
            title.setText("Settings");
            fake.setText("Fake Mode (Demo)");
            lang.setText("Language");
            wifi.setText("Reconnect Wi-Fi");
            about.setText("About developer");
//            button.setText("scan QR");
//            goltext.setText("lalar");
        }
        else { // Default = MN
            title.setText("Тохиргоо");
            fake.setText("Туршилт");
            lang.setText("Хэл");
            wifi.setText("Wi-Fi дахин холбох");
            about.setText("Хөгжүүлэгчийн тухай");
//            button.setText("Намайг Уншуул");
//            goltext.setText("Холболт байхгүй байна");
        }

    }
}
