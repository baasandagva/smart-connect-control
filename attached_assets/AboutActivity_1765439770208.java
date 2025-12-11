package com.example.jb;

import android.os.Bundle;
import android.widget.ImageView;

import androidx.appcompat.app.AppCompatActivity;

public class AboutActivity extends AppCompatActivity {

    ImageView btnBack;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.about_activity);

        // ✔ XML доторх зөв ID
        btnBack = findViewById(R.id.btnBackAbout);

        btnBack.setOnClickListener(v -> finish());
    }
}
