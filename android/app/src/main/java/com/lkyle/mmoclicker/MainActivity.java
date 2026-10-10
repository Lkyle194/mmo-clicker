package com.lkyle.mmoclicker;

import android.os.Bundle;
import androidx.core.view.WindowCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        // Edge-to-edge : le WebView dessine derrière la status bar / nav bar.
        // Cela renseigne env(safe-area-inset-top/bottom) côté CSS pour que
        // l'UI (top-bar) soit abaissée sous la zone caméra/batterie.
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        super.onCreate(savedInstanceState);
    }
}
