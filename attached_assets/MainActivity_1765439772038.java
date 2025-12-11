package com.example.jb;

import android.Manifest;
import android.annotation.TargetApi;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.net.NetworkRequest;
import android.net.wifi.WifiConfiguration;
import android.net.wifi.WifiManager;
import android.net.wifi.WifiNetworkSpecifier;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.view.Gravity;
import android.view.View;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.Switch;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.app.AppCompatDelegate;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.core.view.GravityCompat;
import androidx.drawerlayout.widget.DrawerLayout;

import com.google.android.material.button.MaterialButton;
import com.google.android.material.navigation.NavigationView;

import org.jetbrains.annotations.NotNull;

import java.io.IOException;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import android.view.Menu;
import android.view.MenuItem;

public class MainActivity extends AppCompatActivity {

    public static boolean FAKE_MODE = true;  // SettingsActivity-аас удирдана

    private static final int REQ_PERM_LOCATION = 100;

    private DrawerLayout drawerLayout;
    private NavigationView navigationView;
    private ImageView btnMenu;
    private MaterialButton btnScanQr;
    private TextView txtStatus;
    private LinearLayout deviceList;

    private ConnectivityManager connectivityManager;
    private ConnectivityManager.NetworkCallback networkCallback;
    private final OkHttpClient httpClient = new OkHttpClient();

    private final Handler handler = new Handler();

    //==========================
    // hel solih
    //=========================
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == 100 && resultCode == RESULT_OK) {
            boolean changed = data.getBooleanExtra("lang_changed", false);

            if (changed) {
                updateLanguageUI();   // 🔥 txtStatus, ScanQR шинэчилнэ
            }
        }
    }
    private void updateLanguageUI() {
        SharedPreferences pref = getSharedPreferences("settings", MODE_PRIVATE);
        String code = pref.getString("app_lang", "MN");

        TextView txtStatus = findViewById(R.id.txtStatus);
        TextView btnScan = findViewById(R.id.btnScanQr);

        NavigationView navigationView = findViewById(R.id.navigationView);

        Menu menu = navigationView.getMenu();

        MenuItem btntohooromj = menu.findItem(R.id.nav_connect_wifi);
        MenuItem btntohirgoo = menu.findItem(R.id.nav_settings);
        MenuItem btntuhai = menu.findItem(R.id.nav_about);

        if (code.equals("EN")) {
            txtStatus.setText("No connection");
            btnScan.setText("Scan QR");

            btntohooromj.setTitle("Device connection");
            btntohirgoo.setTitle("Settings");
            btntuhai.setTitle("About");
        } else {
            txtStatus.setText("Холболт байхгүй байна");
            btnScan.setText("QR унших");

            btntohooromj.setTitle("Төхөөрөмж холболт");
            btntohirgoo.setTitle("Тохиргоо");
            btntuhai.setTitle("Тухай");
        }
    }


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // ================================
        // LOAD SETTINGS BEFORE UI
        // ================================
        SharedPreferences pref = getSharedPreferences("app_settings", MODE_PRIVATE);
        boolean isDark = pref.getBoolean("dark_mode", false);

        AppCompatDelegate.setDefaultNightMode(
                isDark ? AppCompatDelegate.MODE_NIGHT_YES : AppCompatDelegate.MODE_NIGHT_NO
        );

        FAKE_MODE = pref.getBoolean("FAKE", true);

        // ================================
        // LOAD UI
        // ================================
        setContentView(R.layout.activity_main);

        // Хэлний текстээ эхний удаад шинэчилнэ
        updateLanguageUI();

        drawerLayout = findViewById(R.id.drawerLayout);
        navigationView = findViewById(R.id.navigationView);
        btnMenu = findViewById(R.id.btnMenu);
        btnScanQr = findViewById(R.id.btnScanQr);
        txtStatus = findViewById(R.id.txtStatus);
        deviceList = findViewById(R.id.deviceList);

        connectivityManager = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);

        // Drawer toggle
        btnMenu.setOnClickListener(v -> drawerLayout.openDrawer(GravityCompat.START));

        navigationView.setNavigationItemSelectedListener(item -> {

            int id = item.getItemId();

            if (id == R.id.nav_connect_wifi) {
                showConnectDialog();
            }
            else if (id == R.id.nav_settings) {
                Intent intent = new Intent(MainActivity.this, SettingsActivity.class);
                startActivityForResult(intent, 100);
            }
            else if (id == R.id.nav_about) {
                startActivity(new Intent(MainActivity.this, AboutActivity.class));
            }

            drawerLayout.closeDrawer(GravityCompat.START);
            return true;
        });


        String lang = getSharedPreferences("settings", MODE_PRIVATE)
                .getString("app_lang", "Монгол");

// Жишээ нь текстүүдийг хэлээр нь өөрчлөх боломжтой
// txtStatus.setText(lang.equals("Монгол") ? "Холболт байхгүй байна" : "No connection");


        // QR button
        btnScanQr.setOnClickListener(v -> {
            if (FAKE_MODE) simulateQrFlow();
            else Toast.makeText(this, "REAL QR уншилт тохируулагдаагүй", Toast.LENGTH_SHORT).show();
        });

        showDisconnectedUI();
    }


    // ===============================================================
    // PERMISSIONS
    // ===============================================================
    private void ensurePermissions() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION)
                != PackageManager.PERMISSION_GRANTED) {

            ActivityCompat.requestPermissions(this,
                    new String[]{Manifest.permission.ACCESS_FINE_LOCATION},
                    REQ_PERM_LOCATION);
        }
    }
    @Override
    public void onRequestPermissionsResult(int requestCode,
                                           @NonNull String[] permissions,
                                           @NonNull int[] grantResults) {

        if (requestCode == REQ_PERM_LOCATION &&
                !(grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED)) {

            Toast.makeText(this,
                    "Location permission Wi-Fi-д хэрэгтэй",
                    Toast.LENGTH_LONG).show();
        }
    }

    // ===============================================================
    // UI STATUS
    // ===============================================================
    private void showDisconnectedUI() {
        txtStatus.setVisibility(View.VISIBLE);
        txtStatus.setText("Холболт байхгүй байна");
    }
    private void updateConnectionUI(boolean isOnline) {
        ImageView imgNoConnection = findViewById(R.id.imgNoConnection);
        TextView txtStatus = findViewById(R.id.txtStatus);
        View deviceList = findViewById(R.id.deviceList);

        if (isOnline) {
            imgNoConnection.setVisibility(View.GONE);
            txtStatus.setVisibility(View.GONE);
            deviceList.setVisibility(View.VISIBLE);
        } else {
            imgNoConnection.setVisibility(View.VISIBLE);
            txtStatus.setVisibility(View.VISIBLE);
            deviceList.setVisibility(View.GONE);
        }
    }



    private void showConnectedUI(String msg) {
        txtStatus.setVisibility(View.VISIBLE);
        txtStatus.setText(msg);
    }

    // ===============================================================
    // FAKE MODE SIMULATION
    // ===============================================================
    private void simulateQrFlow() {

        txtStatus.setText("Төхөөрөмжтэй холбогдож байна...");

        handler.postDelayed(() -> {
            txtStatus.setText("Холболт амжилттай");

            handler.postDelayed(() -> {
                addDevice("Arzetk " + (deviceList.getChildCount() + 1));
                txtStatus.setText("Төхөөрөмж нэмэгдлээ");
            }, 600);

        }, 1200);
    }

    // ===============================================================
    // DEVICE CAPSULE ADD
    // ===============================================================
    private void addDevice(String name) {

        View deviceView = getLayoutInflater().inflate(R.layout.capsule_device, deviceList, false);

        TextView deviceName = deviceView.findViewById(R.id.deviceName);
        ImageView deviceEdit = deviceView.findViewById(R.id.deviceEdit);
        Switch deviceSwitch = deviceView.findViewById(R.id.deviceSwitch);

        deviceName.setText(name);

        deviceView.setBackgroundResource(R.drawable.bg_capsule_off);

        deviceEdit.setOnClickListener(v -> showRenameDialog(deviceName));

        deviceSwitch.setOnCheckedChangeListener((btn, isChecked) -> {

            animateCapsule(deviceView, isChecked);

            if (FAKE_MODE) {
                fakeSendPower(name, isChecked);
            } else {
                String url = isChecked ? "http://192.168.4.1/on"
                        : "http://192.168.4.1/off";

                sendCommandToDevice(url);
            }
        });

        deviceView.setOnLongClickListener(v -> {
            deviceList.removeView(deviceView);
            Toast.makeText(this, name + " устгалаа", Toast.LENGTH_SHORT).show();
            return true;
        });

        deviceList.addView(deviceView, 0);
    }

    // ===============================================================
    // ANIMATION
    // ===============================================================
    private void animateCapsule(@NotNull View v, boolean on) {
        v.animate().cancel();
        v.animate()
                .alpha(0f)
                .setDuration(120)
                .withEndAction(() -> {
                    v.setBackgroundResource(on
                            ? R.drawable.bg_capsule_on
                            : R.drawable.bg_capsule_off);
                    v.setAlpha(0f);
                    v.animate().alpha(1f).setDuration(120).start();
                })
                .start();
    }

    // ===============================================================
    // FAKE POWER SEND
    // ===============================================================
    private void fakeSendPower(String name, boolean on) {
        Toast.makeText(this,
                name + " → " + (on ? "ON" : "OFF"),
                Toast.LENGTH_SHORT).show();

        txtStatus.setText(name + (on ? " асаалттай" : " унтарсан"));

        handler.postDelayed(() ->
                txtStatus.setText("Төхөөрөмжүүдийг удирдах боломжтой"), 1000
        );
    }

    // ===============================================================
    // REAL MODE HTTP SEND
    // ===============================================================
    private void sendCommandToDevice(String url) {

        Request request = new Request.Builder().url(url).build();

        httpClient.newCall(request).enqueue(new Callback() {
            @Override public void onFailure(@NotNull Call call, @NotNull IOException e) {
                runOnUiThread(() -> txtStatus.setText("Алдаа: " + e.getMessage()));
            }

            @Override public void onResponse(@NotNull Call call, @NotNull Response response) throws IOException {
                final String body = response.body() != null ? response.body().string() : "";
                runOnUiThread(() -> txtStatus.setText("Device: " + body));
            }
        });
    }

    // ===============================================================
    // RENAME DIALOG
    // ===============================================================
    private void showRenameDialog(TextView nameView) {

        // Тухайн үеийн хэл авахаа
        SharedPreferences pref = getSharedPreferences("settings", MODE_PRIVATE);
        String code = pref.getString("app_lang", "MN");

        // Хэл дээр үндэслэж текстүүдээ бэлдэнэ
        String title, hint, ok, cancel;

        if (code.equals("EN")) {
            title = "Rename device";
            hint = "New name";
            ok = "OK";
            cancel = "Cancel";
        } else {
            title = "Төхөөрөмжийн нэр солих";
            hint = "Шинэ нэр";
            ok = "Хадгалах";
            cancel = "Болих";
        }

        // Input талбар
        EditText input = new EditText(this);
        input.setHint(hint);

        // Popup үүсгэнэ
        new AlertDialog.Builder(this)
                .setTitle(title)
                .setView(input)
                .setPositiveButton(ok, (d, w) -> {

                    String newName = input.getText().toString().trim();
                    if (!newName.isEmpty()) nameView.setText(newName);

                })
                .setNegativeButton(cancel, null)
                .show();
    }


    // ===============================================================
    // WIFI CONNECT — REAL MODE
    // ===============================================================
    private void showConnectDialog() {

        SharedPreferences pref = getSharedPreferences("settings", MODE_PRIVATE);
        String code = pref.getString("app_lang", "MN");

        String title, hintSsid, hintPass, btnConnect, btnCancel;

        if (code.equals("EN")) {
            title = "Wi-Fi Connect";
            hintSsid = "SSID";
            hintPass = "Password";
            btnConnect = "Connect";
            btnCancel = "Cancel";
        } else {
            title = "Wi-Fi холболт";
            hintSsid = "Нэвтрэх нэр";
            hintPass = "Нууц үг";
            btnConnect = "Холбох";
            btnCancel = "Болих";
        }

        EditText ssid = new EditText(this);
        ssid.setHint(hintSsid);

        EditText pwd = new EditText(this);
        pwd.setHint(hintPass);

        LinearLayout layout = new LinearLayout(this);
        layout.setOrientation(LinearLayout.VERTICAL);
        layout.setPadding(50, 20, 50, 10);
        layout.addView(ssid);
        layout.addView(pwd);

        new AlertDialog.Builder(this)
                .setTitle(title)
                .setView(layout)
                .setPositiveButton(btnConnect, (d, w) -> {

                    if (!FAKE_MODE) {
                        connectToWifi(ssid.getText().toString(), pwd.getText().toString());
                    } else {
                        txtStatus.setText(code.equals("EN")
                                ? "FAKE MODE: Simulating Wi-Fi connection"
                                : "FAKE MODE: Wi-Fi холболтыг дууриаж байна");
                    }

                })
                .setNegativeButton(btnCancel, null)
                .show();
    }

    private void connectToWifi(String ssid, String password) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q)
            connectApi29Plus(ssid, password);
        else
            connectLegacy(ssid, password);
    }

    @TargetApi(Build.VERSION_CODES.Q)
    private void connectApi29Plus(String ssid, String password) {

        txtStatus.setText("Connecting " + ssid + " ...");

        WifiNetworkSpecifier.Builder builder =
                new WifiNetworkSpecifier.Builder().setSsid(ssid);

        if (!password.isEmpty()) builder.setWpa2Passphrase(password);

        NetworkRequest request = new NetworkRequest.Builder()
                .addTransportType(NetworkCapabilities.TRANSPORT_WIFI)
                .setNetworkSpecifier(builder.build())
                .build();

        if (networkCallback != null) {
            try { connectivityManager.unregisterNetworkCallback(networkCallback); }
            catch (Exception ignored) {}
        }

        networkCallback = new ConnectivityManager.NetworkCallback() {

            @Override public void onAvailable(@NonNull Network network) {
                runOnUiThread(() -> {
                    txtStatus.setText("Connected to " + ssid);
                    connectivityManager.bindProcessToNetwork(network);
                });
            }

            @Override public void onLost(@NonNull Network network) {
                runOnUiThread(() -> txtStatus.setText("Холболт тасарлаа"));
            }
        };

        connectivityManager.requestNetwork(request, networkCallback);
    }


    @SuppressWarnings("deprecation")
    private void connectLegacy(String ssid, String password) {

        txtStatus.setText("Connecting...");

        WifiManager wifiManager =
                (WifiManager) getApplicationContext().getSystemService(Context.WIFI_SERVICE);

        WifiConfiguration conf = new WifiConfiguration();
        conf.SSID = "\"" + ssid + "\"";
        conf.preSharedKey = "\"" + password + "\"";

        int netId = wifiManager.addNetwork(conf);
        wifiManager.disconnect();
        wifiManager.enableNetwork(netId, true);
        wifiManager.reconnect();

        txtStatus.setText("Connected to " + ssid);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (networkCallback != null) {
            try { connectivityManager.unregisterNetworkCallback(networkCallback); }
            catch (Exception ignored) {}
        }
    }
}
