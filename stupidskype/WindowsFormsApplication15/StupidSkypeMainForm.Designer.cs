namespace StupidSkype
{
    partial class Form1
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.components = new System.ComponentModel.Container();
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(Form1));
            this.tabControl1 = new System.Windows.Forms.TabControl();
            this.tabHome = new System.Windows.Forms.TabPage();
            this.button1 = new System.Windows.Forms.Button();
            this.flowLayoutPanel2 = new System.Windows.Forms.FlowLayoutPanel();
            this.homelabName = new System.Windows.Forms.Label();
            this.homelabMood = new System.Windows.Forms.Label();
            this.homelabContacts = new System.Windows.Forms.Label();
            this.homelabStatus = new System.Windows.Forms.Label();
            this.tableLayoutPanel1 = new System.Windows.Forms.TableLayoutPanel();
            this.homeGod = new System.Windows.Forms.PictureBox();
            this.label5 = new System.Windows.Forms.Label();
            this.flowLayoutPanel1 = new System.Windows.Forms.FlowLayoutPanel();
            this.label1 = new System.Windows.Forms.Label();
            this.label2 = new System.Windows.Forms.Label();
            this.label3 = new System.Windows.Forms.Label();
            this.label4 = new System.Windows.Forms.Label();
            this.tabCall = new System.Windows.Forms.TabPage();
            this.tabMessaging = new System.Windows.Forms.TabPage();
            this.comboBox2 = new System.Windows.Forms.ComboBox();
            this.pictureBox1 = new System.Windows.Forms.PictureBox();
            this.button2 = new System.Windows.Forms.Button();
            this.label9 = new System.Windows.Forms.Label();
            this.numericUpDown2 = new System.Windows.Forms.NumericUpDown();
            this.label8 = new System.Windows.Forms.Label();
            this.numericUpDown1 = new System.Windows.Forms.NumericUpDown();
            this.msgbutspam1 = new System.Windows.Forms.Button();
            this.msglabSpam = new System.Windows.Forms.TextBox();
            this.label7 = new System.Windows.Forms.Label();
            this.msgSep = new System.Windows.Forms.PictureBox();
            this.label6 = new System.Windows.Forms.Label();
            this.msgbutMass = new System.Windows.Forms.Button();
            this.msglabMass = new System.Windows.Forms.TextBox();
            this.tabOther = new System.Windows.Forms.TabPage();
            this.tabSettings = new System.Windows.Forms.TabPage();
            this.radioButton2 = new System.Windows.Forms.RadioButton();
            this.radioButton1 = new System.Windows.Forms.RadioButton();
            this.timer1 = new System.Windows.Forms.Timer(this.components);
            this.flowLayoutPanel3 = new System.Windows.Forms.FlowLayoutPanel();
            this.tabControl1.SuspendLayout();
            this.tabHome.SuspendLayout();
            this.flowLayoutPanel2.SuspendLayout();
            this.tableLayoutPanel1.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.homeGod)).BeginInit();
            this.flowLayoutPanel1.SuspendLayout();
            this.tabMessaging.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.pictureBox1)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.numericUpDown2)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.numericUpDown1)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.msgSep)).BeginInit();
            this.tabSettings.SuspendLayout();
            this.flowLayoutPanel3.SuspendLayout();
            this.SuspendLayout();
            // 
            // tabControl1
            // 
            resources.ApplyResources(this.tabControl1, "tabControl1");
            this.tabControl1.Controls.Add(this.tabHome);
            this.tabControl1.Controls.Add(this.tabCall);
            this.tabControl1.Controls.Add(this.tabMessaging);
            this.tabControl1.Controls.Add(this.tabOther);
            this.tabControl1.Controls.Add(this.tabSettings);
            this.tabControl1.Name = "tabControl1";
            this.tabControl1.SelectedIndex = 0;
            // 
            // tabHome
            // 
            this.tabHome.Controls.Add(this.flowLayoutPanel2);
            this.tabHome.Controls.Add(this.flowLayoutPanel3);
            this.tabHome.Controls.Add(this.tableLayoutPanel1);
            this.tabHome.Controls.Add(this.flowLayoutPanel1);
            resources.ApplyResources(this.tabHome, "tabHome");
            this.tabHome.Name = "tabHome";
            this.tabHome.UseVisualStyleBackColor = true;
            // 
            // button1
            // 
            resources.ApplyResources(this.button1, "button1");
            this.button1.Name = "button1";
            this.button1.UseVisualStyleBackColor = true;
            this.button1.Click += new System.EventHandler(this.Button1_Click);
            // 
            // flowLayoutPanel2
            // 
            resources.ApplyResources(this.flowLayoutPanel2, "flowLayoutPanel2");
            this.flowLayoutPanel2.Controls.Add(this.homelabName);
            this.flowLayoutPanel2.Controls.Add(this.homelabMood);
            this.flowLayoutPanel2.Controls.Add(this.homelabContacts);
            this.flowLayoutPanel2.Name = "flowLayoutPanel2";
            // 
            // homelabName
            // 
            resources.ApplyResources(this.homelabName, "homelabName");
            this.homelabName.Name = "homelabName";
            // 
            // homelabMood
            // 
            resources.ApplyResources(this.homelabMood, "homelabMood");
            this.homelabMood.Name = "homelabMood";
            // 
            // homelabContacts
            // 
            resources.ApplyResources(this.homelabContacts, "homelabContacts");
            this.homelabContacts.Name = "homelabContacts";
            // 
            // homelabStatus
            // 
            resources.ApplyResources(this.homelabStatus, "homelabStatus");
            this.homelabStatus.ForeColor = System.Drawing.Color.Red;
            this.homelabStatus.Name = "homelabStatus";
            // 
            // tableLayoutPanel1
            // 
            resources.ApplyResources(this.tableLayoutPanel1, "tableLayoutPanel1");
            this.tableLayoutPanel1.Controls.Add(this.homeGod, 0, 1);
            this.tableLayoutPanel1.Controls.Add(this.label5, 0, 0);
            this.tableLayoutPanel1.Name = "tableLayoutPanel1";
            // 
            // homeGod
            // 
            resources.ApplyResources(this.homeGod, "homeGod");
            this.homeGod.Name = "homeGod";
            this.homeGod.TabStop = false;
            // 
            // label5
            // 
            resources.ApplyResources(this.label5, "label5");
            this.label5.Name = "label5";
            // 
            // flowLayoutPanel1
            // 
            resources.ApplyResources(this.flowLayoutPanel1, "flowLayoutPanel1");
            this.flowLayoutPanel1.Controls.Add(this.label1);
            this.flowLayoutPanel1.Controls.Add(this.label2);
            this.flowLayoutPanel1.Controls.Add(this.label3);
            this.flowLayoutPanel1.Controls.Add(this.label4);
            this.flowLayoutPanel1.Name = "flowLayoutPanel1";
            // 
            // label1
            // 
            resources.ApplyResources(this.label1, "label1");
            this.label1.Name = "label1";
            // 
            // label2
            // 
            resources.ApplyResources(this.label2, "label2");
            this.label2.Name = "label2";
            // 
            // label3
            // 
            resources.ApplyResources(this.label3, "label3");
            this.label3.Name = "label3";
            // 
            // label4
            // 
            resources.ApplyResources(this.label4, "label4");
            this.label4.Name = "label4";
            // 
            // tabCall
            // 
            resources.ApplyResources(this.tabCall, "tabCall");
            this.tabCall.Name = "tabCall";
            this.tabCall.UseVisualStyleBackColor = true;
            // 
            // tabMessaging
            // 
            this.tabMessaging.Controls.Add(this.comboBox2);
            this.tabMessaging.Controls.Add(this.pictureBox1);
            this.tabMessaging.Controls.Add(this.button2);
            this.tabMessaging.Controls.Add(this.label9);
            this.tabMessaging.Controls.Add(this.numericUpDown2);
            this.tabMessaging.Controls.Add(this.label8);
            this.tabMessaging.Controls.Add(this.numericUpDown1);
            this.tabMessaging.Controls.Add(this.msgbutspam1);
            this.tabMessaging.Controls.Add(this.msglabSpam);
            this.tabMessaging.Controls.Add(this.label7);
            this.tabMessaging.Controls.Add(this.msgSep);
            this.tabMessaging.Controls.Add(this.label6);
            this.tabMessaging.Controls.Add(this.msgbutMass);
            this.tabMessaging.Controls.Add(this.msglabMass);
            resources.ApplyResources(this.tabMessaging, "tabMessaging");
            this.tabMessaging.Name = "tabMessaging";
            this.tabMessaging.UseVisualStyleBackColor = true;
            // 
            // comboBox2
            // 
            this.comboBox2.FormattingEnabled = true;
            resources.ApplyResources(this.comboBox2, "comboBox2");
            this.comboBox2.Name = "comboBox2";
            // 
            // pictureBox1
            // 
            this.pictureBox1.BackColor = System.Drawing.Color.DarkGray;
            resources.ApplyResources(this.pictureBox1, "pictureBox1");
            this.pictureBox1.Name = "pictureBox1";
            this.pictureBox1.TabStop = false;
            // 
            // button2
            // 
            resources.ApplyResources(this.button2, "button2");
            this.button2.Name = "button2";
            this.button2.UseVisualStyleBackColor = true;
            // 
            // label9
            // 
            resources.ApplyResources(this.label9, "label9");
            this.label9.Name = "label9";
            // 
            // numericUpDown2
            // 
            resources.ApplyResources(this.numericUpDown2, "numericUpDown2");
            this.numericUpDown2.Name = "numericUpDown2";
            this.numericUpDown2.Value = new decimal(new int[] {
            50,
            0,
            0,
            0});
            // 
            // label8
            // 
            resources.ApplyResources(this.label8, "label8");
            this.label8.Name = "label8";
            // 
            // numericUpDown1
            // 
            resources.ApplyResources(this.numericUpDown1, "numericUpDown1");
            this.numericUpDown1.Name = "numericUpDown1";
            this.numericUpDown1.Value = new decimal(new int[] {
            10,
            0,
            0,
            0});
            // 
            // msgbutspam1
            // 
            resources.ApplyResources(this.msgbutspam1, "msgbutspam1");
            this.msgbutspam1.Name = "msgbutspam1";
            this.msgbutspam1.UseVisualStyleBackColor = true;
            this.msgbutspam1.Click += new System.EventHandler(this.Msgbutspam1_Click);
            // 
            // msglabSpam
            // 
            resources.ApplyResources(this.msglabSpam, "msglabSpam");
            this.msglabSpam.Name = "msglabSpam";
            // 
            // label7
            // 
            resources.ApplyResources(this.label7, "label7");
            this.label7.Name = "label7";
            // 
            // msgSep
            // 
            this.msgSep.BackColor = System.Drawing.Color.DarkGray;
            resources.ApplyResources(this.msgSep, "msgSep");
            this.msgSep.Name = "msgSep";
            this.msgSep.TabStop = false;
            // 
            // label6
            // 
            resources.ApplyResources(this.label6, "label6");
            this.label6.Name = "label6";
            // 
            // msgbutMass
            // 
            resources.ApplyResources(this.msgbutMass, "msgbutMass");
            this.msgbutMass.Name = "msgbutMass";
            this.msgbutMass.UseVisualStyleBackColor = true;
            this.msgbutMass.Click += new System.EventHandler(this.MsgbutMass_Click);
            // 
            // msglabMass
            // 
            resources.ApplyResources(this.msglabMass, "msglabMass");
            this.msglabMass.Name = "msglabMass";
            // 
            // tabOther
            // 
            resources.ApplyResources(this.tabOther, "tabOther");
            this.tabOther.Name = "tabOther";
            this.tabOther.UseVisualStyleBackColor = true;
            // 
            // tabSettings
            // 
            this.tabSettings.Controls.Add(this.radioButton2);
            this.tabSettings.Controls.Add(this.radioButton1);
            resources.ApplyResources(this.tabSettings, "tabSettings");
            this.tabSettings.Name = "tabSettings";
            this.tabSettings.UseVisualStyleBackColor = true;
            // 
            // radioButton2
            // 
            resources.ApplyResources(this.radioButton2, "radioButton2");
            this.radioButton2.Name = "radioButton2";
            this.radioButton2.UseVisualStyleBackColor = true;
            this.radioButton2.CheckedChanged += new System.EventHandler(this.RadioButton2_CheckedChanged);
            // 
            // radioButton1
            // 
            resources.ApplyResources(this.radioButton1, "radioButton1");
            this.radioButton1.Checked = true;
            this.radioButton1.Name = "radioButton1";
            this.radioButton1.TabStop = true;
            this.radioButton1.UseVisualStyleBackColor = true;
            this.radioButton1.CheckedChanged += new System.EventHandler(this.RadioButton1_CheckedChanged);
            // 
            // timer1
            // 
            this.timer1.Tick += new System.EventHandler(this.Timer1_Tick);
            // 
            // flowLayoutPanel3
            // 
            resources.ApplyResources(this.flowLayoutPanel3, "flowLayoutPanel3");
            this.flowLayoutPanel3.Controls.Add(this.button1);
            this.flowLayoutPanel3.Controls.Add(this.homelabStatus);
            this.flowLayoutPanel3.Name = "flowLayoutPanel3";
            // 
            // Form1
            // 
            resources.ApplyResources(this, "$this");
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.Controls.Add(this.tabControl1);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedToolWindow;
            this.Name = "Form1";
            this.tabControl1.ResumeLayout(false);
            this.tabHome.ResumeLayout(false);
            this.flowLayoutPanel2.ResumeLayout(false);
            this.flowLayoutPanel2.PerformLayout();
            this.tableLayoutPanel1.ResumeLayout(false);
            this.tableLayoutPanel1.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.homeGod)).EndInit();
            this.flowLayoutPanel1.ResumeLayout(false);
            this.flowLayoutPanel1.PerformLayout();
            this.tabMessaging.ResumeLayout(false);
            this.tabMessaging.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.pictureBox1)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.numericUpDown2)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.numericUpDown1)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.msgSep)).EndInit();
            this.tabSettings.ResumeLayout(false);
            this.tabSettings.PerformLayout();
            this.flowLayoutPanel3.ResumeLayout(false);
            this.flowLayoutPanel3.PerformLayout();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.TabControl tabControl1;
        private System.Windows.Forms.TabPage tabHome;
        private System.Windows.Forms.TabPage tabCall;
        private System.Windows.Forms.TabPage tabMessaging;
        private System.Windows.Forms.TabPage tabOther;
        private System.Windows.Forms.TabPage tabSettings;
        private System.Windows.Forms.TextBox msglabMass;
        private System.Windows.Forms.Button msgbutMass;
        private System.Windows.Forms.Label label6;
        private System.Windows.Forms.PictureBox msgSep;
        private System.Windows.Forms.PictureBox pictureBox1;
        private System.Windows.Forms.Button button2;
        private System.Windows.Forms.Label label9;
        private System.Windows.Forms.NumericUpDown numericUpDown2;
        private System.Windows.Forms.Label label8;
        private System.Windows.Forms.NumericUpDown numericUpDown1;
        private System.Windows.Forms.Button msgbutspam1;
        private System.Windows.Forms.TextBox msglabSpam;
        private System.Windows.Forms.Label label7;
        private System.Windows.Forms.RadioButton radioButton2;
        private System.Windows.Forms.RadioButton radioButton1;
        private System.Windows.Forms.ComboBox comboBox2;
        private System.Windows.Forms.Timer timer1;
        private System.Windows.Forms.TableLayoutPanel tableLayoutPanel1;
        private System.Windows.Forms.PictureBox homeGod;
        private System.Windows.Forms.Label label5;
        private System.Windows.Forms.FlowLayoutPanel flowLayoutPanel1;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.Label homelabStatus;
        private System.Windows.Forms.FlowLayoutPanel flowLayoutPanel2;
        private System.Windows.Forms.Label homelabName;
        private System.Windows.Forms.Label homelabMood;
        private System.Windows.Forms.Label homelabContacts;
        private System.Windows.Forms.Button button1;
        private System.Windows.Forms.FlowLayoutPanel flowLayoutPanel3;
    }
}

